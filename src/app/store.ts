import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import modalReducer from '../features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer,
  },
});

// 스토어 전체 상태 타입 (useSelector에서 사용)
export type RootState = ReturnType<typeof store.getState>;
// dispatch 타입 (thunk 등 확장 시 안전하게 추론)
export type AppDispatch = typeof store.dispatch;
