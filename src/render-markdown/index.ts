import { renderTemplate } from '../render-template';
import MD from 'markdown-it';
import hljs from 'highlight.js';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTableOfContents from 'markdown-it-table-of-contents';
import { readFile } from 'fs/promises';
import { join } from 'path';

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
  const template = await readFile(
    join(__dirname, '../articles/article-template.html'),
    'utf-8',
  );
  const result = md.render(markdown);
  return renderTemplate(template.toString(), {
    title,
    body: result,
  });
}
