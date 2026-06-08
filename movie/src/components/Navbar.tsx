import { Clapperboard, Film } from 'lucide-react';
import { memo } from 'react';

interface NavbarProps {
  resultCount: number;
}

const Navbar = memo(({ resultCount }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-20 border-b border-[#2e2a26] bg-[#11100f]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#e64646] text-white">
            <Clapperboard size={23} />
          </span>
          <h1 className="text-xl font-bold">
            UMC <span className="font-medium text-[#d0c7b8]">Movie Finder</span>
          </h1>
        </div>

        <div className="flex h-10 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1b1917] px-3 text-sm text-[#d0c7b8]">
          <Film size={18} className="text-[#43b7a7]" />
          <span>{resultCount.toLocaleString('ko-KR')}편</span>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
