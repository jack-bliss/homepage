import { render } from 'preact-render-to-string';

export function body() {
  return render(
    <>
      <div>Rendered on the server!!</div>
      <img src="/nausicaa.png" />
      <div id="root"></div>
    </>,
  );
}
