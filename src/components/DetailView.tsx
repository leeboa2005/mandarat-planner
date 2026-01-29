import { useState, useMemo } from 'react';
import ProgressBar from './ProgressBar';
import SubGoalItem from './Subgoalitem';
import EditGoalModal from './EditgoalModal';

interface Props {
  goal: any;
  mandalart: any;
  onBack: () => void;
  onUpdate: (updatedData: any) => void;
}

export default function DetailView({ goal, mandalart, onBack, onUpdate }: Props) {
  const [editingSubGoal, setEditingSubGoal] = useState<any>(null);

  // 현재 목표의 달성률 계산
  const progress = useMemo(() => {
    const tasks = goal.sub_goals.filter((sg: any) => sg.content.trim() !== "");
    const completed = tasks.filter((sg: any) => sg.is_completed).length;
    return tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  }, [goal]);

  // 서브 목표 업데이트
  const updateSubGoal = (subGoalId: number, content: string, isCompleted: boolean) => {
    const updatedGoals = mandalart.goals.map((g: any) => {
      if (g.id === goal.id) {
        return {
          ...g,
          sub_goals: g.sub_goals.map((sg: any) => {
            if (sg.id === subGoalId) {
              return { ...sg, content, is_completed: isCompleted };
            }
            return sg;
          })
        };
      }
      return g;
    });

    onUpdate({ ...mandalart, goals: updatedGoals });
  };

  // 서브 목표 삭제
  const deleteSubGoal = (subGoalId: number) => {
    const updatedGoals = mandalart.goals.map((g: any) => {
      if (g.id === goal.id) {
        return {
          ...g,
          sub_goals: g.sub_goals.map((sg: any) => {
            if (sg.id === subGoalId) {
              return { ...sg, content: '', is_completed: false };
            }
            return sg;
          })
        };
      }
      return g;
    });

    onUpdate({ ...mandalart, goals: updatedGoals });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white w-full max-w-[400px] rounded-[32px] p-8 shadow-2xl animate-in fade-in duration-500">
        
        {/* 상단 네비게이션 */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black mb-2 text-gray-900">
            {goal.title}
          </h2>
            <div className="text-center mb-4">
                <p className="text-gray-400 text-sm font-medium">이 목표를 이루기 위한 행동들을 정리해보세요.</p>
            </div>
          <ProgressBar progress={progress} />
        </div>

        {/* 3x3 서브 목표 그리드 */}
            <div className="grid grid-cols-3 gap-3 w-full mb-6">
            {[...Array(9)].map((_, i) => {
                // 중앙 셀 - 목표 제목 표시
                if (i === 4) {
                return (
                   <div 
                  key="center" 
                  className="w-full h-full rounded-[20px] bg-black flex flex-col items-center justify-center text-white shadow-lg"
                >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="black"
                stroke="white"
                strokeWidth={1.5}
                className="w-7.5 h-7.5"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3.75l2.475 5.01 5.525.804-4 3.898.945 5.51L12 16.98l-4.945 2.597.945-5.51-4-3.898 5.525-.804L12 3.75z"
                />
                </svg>
                  <span className="text-[11px] font-bold tracking-tight">세부 목표</span>
                </div>
                );
                }
                const subGoalIndex = i < 4 ? i : i - 1;
                const subGoal = goal.sub_goals[subGoalIndex];

                return (
                <SubGoalItem
                    key={subGoal.id}
                    subGoal={subGoal}
                    onClick={() => setEditingSubGoal(subGoal)}
                />
                );
            })}
        </div>
      </div>

      {/* 편집 모달 */}
      {editingSubGoal && (
        <EditGoalModal
          subGoal={editingSubGoal}
          onClose={() => setEditingSubGoal(null)}
           onSave={(content: string, isCompleted: boolean) => {
            updateSubGoal(editingSubGoal.id, content, isCompleted);
            }}
          onDelete={() => {
            deleteSubGoal(editingSubGoal.id);
          }}
        />
      )}
    </div>
  );
}