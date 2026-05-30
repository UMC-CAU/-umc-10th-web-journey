import { ShoppingCart, Disc3 } from 'lucide-react';
import { useAppSelector } from '../app/hooks';

const Navbar = () => {
  // 전체 수량(amount)을 store에서 구독해 뱃지로 표시
  const amount = useAppSelector((state) => state.cart.amount);

  return (
    <nav className="sticky top-0 z-10 h-[72px] border-b border-[#2c3344] bg-[#0d1017]/70 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <Disc3 className="text-[#9d86ff]" size={28} />
          <h1 className="text-xl font-bold tracking-wide">
            UMC <span className="font-medium text-[#9aa3b5]">Records</span>
          </h1>
        </div>

        <div className="relative flex items-center">
          <ShoppingCart size={26} />
          {amount > 0 && (
            <span className="absolute -right-3 -top-2.5 grid h-[22px] min-w-[22px] place-items-center rounded-full bg-[#7c5cff] px-1.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(124,92,255,0.5)]">
              {amount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
