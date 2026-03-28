import { useTheme } from '../contexts/ThemeContext';

const ThemeContent = () => {
  const { theme } = useTheme();

  return (
    <main className={`content ${theme}`}>
      <h1>현재 모드: {theme.toUpperCase()}</h1>
    </main>
  );
};

export default ThemeContent;