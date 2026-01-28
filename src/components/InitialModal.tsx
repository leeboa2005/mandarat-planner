import { useState } from 'react';

interface Props {
  onSubmit: (mainGoal: string, subGoals: string[]) => void;
}

export default function InitialModal({ onSubmit }: Props) {
  // 주변 8개 목표만 상태로 관리합니다.
  const [subGoals, setSubGoals] = useState(Array(8).fill(""));

  const handleSubmit = () => {
    // 8개 중 하나라도 비어있으면 경고 (만다라트는 꽉 채워야 제맛이니까요!)
    if (subGoals.some(g => g.trim() === "")) {
      return alert("8개의 세부 목표를 모두 채워주세요!");
    }
    
    // 중앙 핵심 제목은 여기서 정하거나, 나중에 수정 가능하게 넘깁니다.
    const coreTitle = "나의 핵심 목표"; 
    onSubmit(coreTitle, subGoals);
  };

  const getSubGoalIndex = (i: number) => (i < 4 ? i : i - 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[360px] rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">2026 목표</h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">8개의 목표를 세워서 실천하기</p>
        </div>

        <div className="grid grid-cols-3 gap-3 aspect-square mb-8">
          {[...Array(9)].map((_, i) => {
            // 중앙
            if (i === 4) {
              return (
                <div 
                  key="center" 
                  className="w-full h-full rounded-2xl bg-black flex flex-col items-center justify-center text-white space-y-1 shadow-lg shadow-black/20"
                >
                  {/* 흰색 별 아이콘 (SVG) */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] font-black font-semibold tracking-tighter opacity-80 uppercase">핵심 목표</span>
                </div>
              );
            }

            // 주변 8개: 세부 목표 입력
            const subIdx = getSubGoalIndex(i);
            return (
              <input
                key={`sub-${subIdx}`}
                value={subGoals[subIdx]}
                onChange={(e) => {
                  const newSubs = [...subGoals];
                  newSubs[subIdx] = e.target.value;
                  setSubGoals(newSubs);
                }}
                placeholder={`${subIdx + 1}`}
                className="w-full h-full text-center text-xs p-2 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-black focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 transition-all placeholder-gray-300 font-medium"
              />
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-5 rounded-[24px] font-semibold text-lg active:scale-[0.97] transition-all shadow-xl shadow-black/10"
        >
          계획 생성하기
        </button>
      </div>
    </div>
  );
}