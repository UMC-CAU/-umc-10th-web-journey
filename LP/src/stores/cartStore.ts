import { create } from 'zustand';
import cartItemsData from '../constants/cartItems';
import type { CartItemType } from '../constants/cartItems';

// Zustand 스토어 상태 + 액션 타입 (TypeScript 직접 정의)
interface CartState {
  cartItems: CartItemType[]; // 장바구니에 담긴 음반 배열
  amount: number;            // 전체 수량
  total: number;             // 전체 금액
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

// cartItems로부터 총 수량/총 금액 계산 (price가 string이므로 Number로 변환)
const getTotals = (cartItems: CartItemType[]) => {
  let amount = 0;
  let total = 0;
  cartItems.forEach((item) => {
    amount += item.amount;
    total += item.amount * Number(item.price);
  });
  return { amount, total };
};

export const useCartStore = create<CartState>()((set) => ({
  // 기존 Redux cart 초기값을 그대로 이전 + 초기 합계 자동 계산
  cartItems: cartItemsData,
  ...getTotals(cartItemsData),

  // 수량 1 증가 (변경 후 합계 자동 갱신)
  increase: (id) =>
    set((state) => {
      const cartItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      );
      return { cartItems, ...getTotals(cartItems) };
    }),

  // 수량 1 감소 — 1 미만이 되면 자동 삭제
  decrease: (id) =>
    set((state) => {
      const cartItems = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount >= 1);
      return { cartItems, ...getTotals(cartItems) };
    }),

  // 특정 음반 즉시 삭제
  removeItem: (id) =>
    set((state) => {
      const cartItems = state.cartItems.filter((item) => item.id !== id);
      return { cartItems, ...getTotals(cartItems) };
    }),

  // 전체 삭제 + 수량/금액 0으로 초기화
  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

  // 합계 계산 (필요 시 수동 호출용 — 현재는 각 액션이 자동 갱신)
  calculateTotals: () => set((state) => getTotals(state.cartItems)),
}));
