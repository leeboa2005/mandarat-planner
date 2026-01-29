import { useState, useEffect } from 'react';

interface Props {
  subGoal: {
    id: number;
    content: string;
    is_completed: boolean;
  };
  onClose: () => void;
  onSave: (content: string, isCompleted: boolean) => void;
  onDelete: () => void;
}

export default function EditGoalModal({ subGoal, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(subGoal.content);
  const [isCompleted, setIsCompleted] = useState(subGoal.is_completed);

  useEffect(() => {
    setTitle(subGoal.content);
    setIsCompleted(subGoal.is_completed);
  }, [subGoal]);

  const handleSave = () => {
    if (title.trim() === "") {
      return alert("Goal Title을 입력해주세요!");
    }
    onSave(title.trim(), isCompleted);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("이 세부 목표를 삭제하시겠습니까?")) {
      onDelete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900"> 세부 목표</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 작성 */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-900 mb-2">
             내용
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="세부 목표 내용을 입력하세요"
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-black transition-all text-sm font-medium"
            autoFocus
          />
        </div>

        {/* 완료 버튼 */}
        <div className="mb-6">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-sm font-bold text-gray-900">🎉 달성 했어요! 🎉</span>
            <button
              type="button"
              onClick={() => setIsCompleted(!isCompleted)}
              className={`
                relative w-12 h-7 rounded-full transition-colors duration-200
                ${isCompleted ? 'bg-black' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200
                  ${isCompleted ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </label>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-3">
            {/* 삭제 */}
            {/* {subGoal.content.trim() !== "" && (
            <div className="mt-4 text-left">
                <button
                onClick={handleDelete}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                이 세부 목표 삭제
                </button>
            </div>
            )} */}
            <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 active:scale-[0.98] transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-2xl bg-black text-white font-bold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}