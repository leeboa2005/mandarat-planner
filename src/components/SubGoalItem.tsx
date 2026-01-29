interface Props {
  subGoal: {
    id: number;
    content: string;
    is_completed: boolean;
  };
  onClick: () => void;
}

export default function SubGoalItem({ subGoal, onClick }: Props) {
  const isEmpty = subGoal.content.trim() === "";

  // 공통 클래스
  const baseClass = "relative aspect-square rounded-[20px] transition-all flex items-center justify-center overflow-hidden";

  // 비어있는 셀
  if (isEmpty) {
    return (
      <button
        onClick={onClick}
        className={`${baseClass} border-2 border-dashed border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 group`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-300 group-hover:text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    );
  }

  // 채워진 셀
  return (
    <button
      onClick={onClick}
      className={`${baseClass} border-2 border-gray-100 bg-white p-2 hover:border-gray-300 hover:shadow-sm group`}
    >
      {/* 완료 체크 표시 */}
      {subGoal.is_completed && (
        <div className="absolute top-3 left-3 z-10">
          <div className="w-4 h-4 rounded bg-black border-2 border-black flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 내용 영역*/}
      <div className="w-full h-full flex items-center justify-center px-1">
        <span className={`
          text-[10.5px] font-medium text-center leading-[1.3]
          overflow-hidden text-ellipsis line-clamp-3
          ${subGoal.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}
        `}>
          {subGoal.content}
        </span>
      </div>

      {/* 편집 아이콘 */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </div>
    </button>
  );
}