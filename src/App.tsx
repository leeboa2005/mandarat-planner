import { useEffect, useState } from 'react';
import { supabase } from './lib/supbase';
import InitialModal from './components/InitialModal';
import MandalartGrid from './components/MandalartGrid';
import DetailView from './components/DetailView';

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [mandalart, setMandalart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        await fetchMandalart(session.user.id);
      }
      setLoading(false);
    };
    init();
  }, []);

  const fetchMandalart = async (id: string) => {
    const { data } = await supabase
      .from('boards')
      .select('*')
      .eq('user_id', id)
      .maybeSingle();
    
    if (data) setMandalart(data);
  };

  const handleCreate = async (mainGoal: string, subGoals: string[]) => {
    const { data: { user }, error: authError } = await supabase.auth.signInAnonymously();
    if (authError || !user) return alert("로그인 오류가 발생했습니다.");

    const gridTitles = [
      ...subGoals.slice(0, 4),
      mainGoal,
      ...subGoals.slice(4)
    ];

    const initialData = {
      user_id: user.id,
      title: mainGoal,
      goals: gridTitles.map((title, i) => ({
        id: i,
        title: title,
        sub_goals: Array.from({ length: 8 }, (_, j) => ({
          id: j,
          content: "",
          is_completed: false
        }))
      }))
    };

    const { data: insertedData, error: insError } = await supabase
      .from('boards')
      .insert([initialData])
      .select()
      .single();

    if (insError) {
      console.error(insError);
      return alert("저장 오류가 발생했습니다.");
    }

    setUserId(user.id);
    setMandalart(insertedData);
  };

  const updateMandalart = async (updatedData: any) => {
    if (!userId) return;

    const { error } = await supabase
      .from('boards')
      .update(updatedData)
      .eq('user_id', userId);

    if (error) {
      console.error(error);
      return alert("업데이트 오류가 발생했습니다.");
    }

    setMandalart(updatedData);
  };

  const handleGoalClick = (goalId: number) => {
    // 중앙 셀(4번)은 선택 불가
    if (goalId === 4) return;
    setSelectedGoalId(goalId);
  };

  const handleBackToGrid = () => {
    setSelectedGoalId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse font-bold text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {!mandalart && <InitialModal onSubmit={handleCreate} />}

      {/* 개발용 초기화 버튼 */}
      <button 
        onClick={async () => {
          await supabase.auth.signOut();
          setMandalart(null);
          setUserId(null);
          setSelectedGoalId(null);
        }}
        className="fixed bottom-4 right-4 bg-black text-white p-2 rounded-full text-xs z-[200]"
      >
        초기화(테스트용)
      </button>

      {mandalart && (
        <>
          {selectedGoalId === null ? (
            <MandalartGrid 
              mandalart={mandalart}
              onGoalClick={handleGoalClick}
            />
          ) : (
            <DetailView
              goal={mandalart.goals[selectedGoalId]}
              mandalart={mandalart}
              onBack={handleBackToGrid}
              onUpdate={updateMandalart}
            />
          )}
        </>
      )}
    </div>
  );
}