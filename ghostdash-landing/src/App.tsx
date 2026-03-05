import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GhostDashLanding } from './pages/GhostDashLanding';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GhostDashLanding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
