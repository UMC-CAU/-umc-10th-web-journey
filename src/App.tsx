import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ThemeContent from './components/ThemeContent';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Navbar />
        <ThemeContent />
      </div>
    </ThemeProvider>
  );
}

export default App;