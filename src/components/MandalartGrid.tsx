import { useMemo } from 'react';
import ProgressBar from './ProgressBar';

interface Props {
  mandalart: any;
  onGoalClick: (goalId: number) => void;
}

export default function MandalartGrid({ mandalart, onGoalClick }: Props) {
const currentYear = new Date().getFullYear();

  // 전체 달성률 계산 (세부 포함)
  const totalProgress = useMemo(() => {
    if (!mandalart?.goals) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;

    // 중앙 셀(4번) 제외하고 주변 8개 목표만 계산
    mandalart.goals.forEach((goal: any, index: number) => {
      if (index === 4) return; // 중앙 셀 제외
      
      goal.sub_goals.forEach((subGoal: any) => {
        if (subGoal.content.trim() !== "") {
          totalTasks++;
          if (subGoal.is_completed) completedTasks++;
        }
      });
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }, [mandalart]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white w-full max-w-[400px] rounded-[32px] p-8 shadow-2xl animate-in fade-in duration-700">
        
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
             {currentYear} 만다르트 차트
          </h1>
          <p className="text-center text-sm text-gray-400 font-medium mb-5">
             핵심 목표 설정 완료! 이제 세부 목표를 작성해보세요.
          </p>
          <ProgressBar progress={totalProgress} />
        </div>

        {/* 3x3 만다라트 그리드 */}
        <div className="grid grid-cols-3 gap-3 aspect-square mb-6">
          {mandalart.goals.map((goal: any, index: number) => {
            const isCenterCell = index === 4;

            return (
              <button
                key={goal.id}
                onClick={() => !isCenterCell && onGoalClick(goal.id)}
                disabled={isCenterCell}
               className={`
                aspect-square
                rounded-[20px]
                flex items-center justify-center
                transition-all
                ${isCenterCell
                    ? 'bg-black text-white shadow-lg cursor-default'
                    : 'bg-gray-50 cursor-pointer'
                }
                `}
              >
                {/* 중앙 셀 - 핵심 목표 */}
                {isCenterCell && (
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mb-1 text-white">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[11px] font-bold tracking-tight">
                      핵심 목표
                    </span>
                  </div>
                )}

                {/* 주변 셀 - 세부 목표들 */}
                {!isCenterCell && (
                <span className="text-xs font-medium text-gray-700 leading-tight">
                  {goal.title}
                </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}