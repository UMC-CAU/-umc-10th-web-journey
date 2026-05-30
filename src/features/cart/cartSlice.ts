import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import cartItemsData from '../../constants/cartItems';
import type { CartItemType } from '../../constants/cartItems';

interface CartState {
  cartItems: CartItemType[]; // 장바구니에 담긴 음반 배열
  amount: number;            // 전체 수량
  total: number;             // 전체 금액
}

const initialState: CartState = {
  cartItems: cartItemsData,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 전체 삭제 (장바구니 비우기) — 수량/금액도 0으로 초기화
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    // 특정 음반 즉시 제거 (payload: id)
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    // 수량 1 증가 (payload: id)
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) item.amount += 1;
    },
    // 수량 1 감소 — 1보다 작아지면 해당 아이템 자동 제거 (payload: id)
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (!item) return;
      item.amount -= 1;
      if (item.amount < 1) {
        state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      }
    },
    // 전체 수량(amount)과 총 금액(total) 계산 — price가 string이므로 Number로 변환
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * Number(item.price);
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
