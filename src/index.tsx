import { createRoot } from 'react-dom/client';

const App = () => <h1>FloresCCTV app</h1>;

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);