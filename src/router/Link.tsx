import type { MouseEvent } from 'react';
import type { LinkProps } from './types';
import { getCurrentPath, navigateTo } from './utils';


export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (getCurrentPath() === to) return; // 현재와 동일한 경우
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};