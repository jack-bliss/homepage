import { render } from 'preact';
import { Component } from './component';

function App() {
  return (
    <div>
      <p>Hello from the client!</p>
      <p>
        <Component />
      </p>
    </div>
  );
}

render(<App />, document.getElementById('root') as HTMLElement);
