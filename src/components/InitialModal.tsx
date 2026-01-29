import { useState } from 'react';

interface Props {
  onSubmit: (mainGoal: string, subGoals: string[]) => void;
}

export default function InitialModal({ onSubmit }: Props) {
  const [subGoals, setSubGoals] = useState(Array(8).fill(""));
  const currentYear = new Date().getFullYear();


  const handleSubmit = () => {
    if (subGoals.some(g => g.trim() === "")) {
      return alert("8개의 세부 목표를 모두 채워주세요!");
    }
    
    const coreTitle = "핵심 목표"; 
    onSubmit(coreTitle, subGoals);
  };

  const getSubGoalIndex = (i: number) => (i < 4 ? i : i - 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white w-full max-w-[400px] rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">{currentYear} 만다라트 차트</h2>
          <p className="text-gray-400 text-sm font-medium mb-5">핵심 목표 8가지를 세워보세요.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 aspect-square mb-8">
          {[...Array(9)].map((_, i) => {
            // 중앙
            if (i === 4) {
              return (
                <div 
                  key="center" 
                  className="w-full h-full rounded-[20px] bg-black flex flex-col items-center justify-center text-white shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white mb-1">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[11px] font-bold tracking-tight">핵심 목표</span>
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
                placeholder={`목표 ${subIdx + 1}`}
                className="w-full h-full text-center text-xs p-3 rounded-[20px] border-0 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder-gray-300 font-medium"
              />
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 rounded-[20px] font-bold text-base active:scale-[0.98] transition-all shadow-lg"
        >
          계획 생성하기
        </button>
      </div>
    </div>
  );
}