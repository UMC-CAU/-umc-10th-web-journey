import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { calculateTotals } from './features/cart/cartSlice';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import Modal from './components/Modal';

function App() {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const dispatch = useAppDispatch();

  // cartItems가 바뀔 때마다 amount/total 재계산 (수량 증가/감소/삭제 시 자동 반영)
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-[#eef1f7] bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(124,92,255,0.18),transparent_60%),radial-gradient(900px_500px_at_0%_0%,rgba(80,200,255,0.10),transparent_55%)]">
      {isOpen && <Modal />}
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10">
        <CartContainer />
      </main>
    </div>
  );
}

export default App;
