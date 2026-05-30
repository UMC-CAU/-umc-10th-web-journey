import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../app/hooks';
import { increase, decrease, removeItem } from '../features/cart/cartSlice';
import type { CartItemType } from '../constants/cartItems';

const CartItem = ({ id, img, title, singer, price, amount }: CartItemType) => {
  const dispatch = useAppDispatch();

  return (
    <article className="grid grid-cols-[84px_1fr_auto] items-center gap-4 rounded-2xl border border-[#2c3344] bg-gradient-to-b from-[#1a1f2b] to-[#141821] p-4 transition hover:-translate-y-0.5 hover:border-[#7c5cff]/50">
      <img
        src={img}
        alt={title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-[84px] w-[84px] rounded-xl bg-[#222837] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
      />

      <div className="flex min-w-0 flex-col gap-0.5">
        <h4 className="truncate text-base font-bold">{title}</h4>
        <p className="truncate text-sm text-[#9aa3b5]">{singer}</p>
        <p className="mt-1 font-bold text-[#9d86ff]">₩{Number(price).toLocaleString()}</p>
        <button
          onClick={() => dispatch(removeItem(id))}
          className="mt-1.5 flex w-fit items-center gap-1.5 text-xs text-[#9aa3b5] transition hover:text-[#ff5c7a]"
        >
          <Trash2 size={14} />
          삭제
        </button>
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          aria-label="수량 증가"
          onClick={() => dispatch(increase(id))}
          className="grid h-7 w-[34px] place-items-center rounded-lg border border-[#2c3344] bg-[#222837] text-[#9d86ff] transition hover:bg-[#7c5cff] hover:text-white active:scale-90"
        >
          <ChevronUp size={18} />
        </button>
        <p className="min-w-6 text-center text-base font-bold">{amount}</p>
        <button
          aria-label="수량 감소"
          onClick={() => dispatch(decrease(id))}
          className="grid h-7 w-[34px] place-items-center rounded-lg border border-[#2c3344] bg-[#222837] text-[#9d86ff] transition hover:bg-[#7c5cff] hover:text-white active:scale-90"
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </article>
  );
};

export default CartItem;
