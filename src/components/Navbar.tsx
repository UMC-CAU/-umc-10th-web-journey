import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`navbar ${theme}`}>
      <button onClick={toggleTheme}>
        {theme === 'light' ? '다크 모드로 변경' : '라이트 모드로 변경'}
      </button>
    </nav>
  );
};

export default Navbar;