import { create } from 'zustand';
import { useCartStore } from './cartStore';

interface ModalState {
  isOpen: boolean;          // 모달 열림/닫힘 상태
  openModal: () => void;
  closeModal: () => void;
  confirmClear: () => void; // "네": 전체 삭제 + 모달 닫기 (다른 스토어와 연동)
}

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),

  // 다른 스토어(cart)의 clearCart 액션과 연동 후 모달 닫기
  confirmClear: () => {
    useCartStore.getState().clearCart();
    set({ isOpen: false });
  },
}));
