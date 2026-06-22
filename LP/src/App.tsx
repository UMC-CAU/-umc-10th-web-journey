import { useModalStore } from './stores/modalStore';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import Modal from './components/Modal';

function App() {
  // 모달 열림 상태만 구독 (합계는 각 cart 액션에서 자동 계산되어 useEffect 불필요)
  const isOpen = useModalStore((state) => state.isOpen);

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
