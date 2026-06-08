import { useCartStore } from '../stores/cartStore';
import { useModalStore } from '../stores/modalStore';
import CartItem from './CartItem';

const CartContainer = () => {
  // 상태와 액션을 구조 분해 할당으로 가져오기
  const { cartItems, total, amount } = useCartStore();
  const { openModal } = useModalStore();

  // 장바구니가 비어 있을 때
  if (amount < 1) {
    return (
      <section className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">나의 플레이리스트</h2>
        <p className="mt-16 text-[#9aa3b5]">장바구니가 비어 있습니다.</p>
      </section>
    );
  }

  return (
    <section>
      <header className="mb-7 flex items-baseline justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight">나의 플레이리스트</h2>
        <p className="text-sm text-[#9aa3b5]">{amount}개의 음반</p>
      </header>

      <div className="flex flex-col gap-3.5">
        {cartItems.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>

      <footer className="mt-8 border-t border-[#2c3344] pt-6">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>총 결제 금액</span>
          <span className="text-2xl font-extrabold">₩{total.toLocaleString()}</span>
        </div>
        <button
          onClick={() => openModal()}
          className="mt-5 w-full rounded-2xl border border-[#ff5c7a]/40 bg-[#ff5c7a]/10 py-3.5 text-sm font-bold text-[#ff5c7a] transition hover:bg-[#ff5c7a]/20"
        >
          장바구니 비우기
        </button>
      </footer>
    </section>
  );
};

export default CartContainer;
