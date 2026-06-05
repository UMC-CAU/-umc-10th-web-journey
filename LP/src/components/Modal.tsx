import { useModalStore } from '../stores/modalStore';

const Modal = () => {
  // 닫기 + (네 버튼용) 전체삭제·닫기 연동 액션을 구조 분해 할당으로 가져오기
  const { closeModal, confirmClear } = useModalStore();

  return (
    <div
      onClick={() => closeModal()}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm"
    >
      {/* 내부 클릭 시 오버레이로 전파되어 닫히지 않도록 차단 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(90%,380px)] rounded-[20px] border border-[#2c3344] bg-gradient-to-b from-[#1a1f2b] to-[#141821] p-8 text-center shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
      >
        <h4 className="text-lg font-bold">장바구니를 모두 비우시겠습니까?</h4>
        <p className="mt-2.5 text-sm text-[#9aa3b5]">담아두신 모든 음반이 삭제됩니다.</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => confirmClear()}
            className="flex-1 rounded-xl bg-[#ff5c7a] py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            네, 비울게요
          </button>
          <button
            onClick={() => closeModal()}
            className="flex-1 rounded-xl border border-[#2c3344] bg-[#222837] py-3 text-sm font-bold text-[#eef1f7] transition hover:bg-[#2c3344]"
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
