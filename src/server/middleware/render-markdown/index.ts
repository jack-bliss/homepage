import { getAsset, renderTemplate } from '../../services';
import MD from 'markdown-it';
import hljs from 'highlight.js';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTableOfContents from 'markdown-it-table-of-contents';

hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript'),
);

const md = new MD({
  typographer: true,
  highlight: (str, lang = 'javascript') => {
    try {
      return `<pre class="hljs"><code>${
        hljs.highlightAuto(str).value
      }</code></pre>`;
    } catch (error) {
      console.error(error);
      return `<pre>${str}</pre>`;
    }
  },
});

md.use(markdownItAnchor);
md.use(markdownItTableOfContents, {
  includeLevel: [1, 2, 3, 4],
});

export async function renderMarkdown(title: string, markdown: string) {
  const template = await getAsset('markdown-template.html');
  const result = md.render(markdown);
  return renderTemplate(template.toString(), {
    title,
    body: result,
  });
}

export async function renderMarkdownFromAsset(
  title: string,
  path: string,
) {
  const [asset, template] = await Promise.all([
    getAsset(path),
    getAsset('markdown-template.html'),
  ]);
  const body = md.render(asset.toString('utf-8'));
  return renderTemplate(template.toString(), {
    title,
    body,
  });
}
