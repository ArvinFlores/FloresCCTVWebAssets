import type { FunctionComponent } from 'react';
import { createRoot } from 'react-dom/client';

const App: FunctionComponent = () => {
  return <h1>FloresCCTV app</h1>;
};

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
