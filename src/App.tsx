import { useEffect, useState } from 'react';
import { supabase } from './lib/supbase'; 
import InitialModal from './components/InitialModal';

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [mandalart, setMandalart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // 수정된 제출 핸들러 (1개 핵심 + 8개 세부 목표를 받음)
  const handleCreate = async (mainGoal: string, subGoals: string[]) => {
    // 1. 익명 로그인
    const { data: { user }, error: authError } = await supabase.auth.signInAnonymously();
    if (authError || !user) return alert("로그인 오류가 발생했습니다.");

    // 2. 3x3 격자 데이터 재구성 (중앙 4번 인덱스에 mainGoal 배치)
    const gridTitles = [
      ...subGoals.slice(0, 4), // 0, 1, 2, 3번
      mainGoal,                // 4번 (중앙)
      ...subGoals.slice(4)     // 5, 6, 7, 8번
    ];

    const initialData = {
      user_id: user.id,
      title: mainGoal,
      // 9개 구역(goals) 각각이 또 8개의 sub_goals 
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

    // 3. DB 저장
    const { data: insertedData, error: insError } = await supabase
      .from('boards')
      .insert([initialData])
      .select()
      .single();

    if (insError) {
      console.error(insError);
      return alert("저장 오류가 발생했습니다.");
    }

    // 4. 상태 업데이트
    setUserId(user.id);
    setMandalart(insertedData);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse font-bold text-gray-400">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 데이터가 없으면 모달을 띄움 (수정된 인자 전달) */}
      {!mandalart && <InitialModal onSubmit={handleCreate} />}

      {/* 개발용 : 데이터 초기화 */}
     <button 
        onClick={async () => {
          await supabase.auth.signOut();
          // 직접 초가화
          setMandalart(null);
          setUserId(null);
        }}
        className="fixed bottom-4 right-4 bg-black text-white p-2 rounded-full text-xs z-[200]"
      >
        초기화(테스트용)
      </button>
      

      {/* 메인 대시보드 UI */}
      {mandalart && (
        <main className="p-6 max-w-lg mx-auto animate-in fade-in duration-700">
          <header className="py-8">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">My Plan</span>
            <h1 className="text-4xl font-black italic mt-2 leading-tight">
              {mandalart.title}
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black w-[0%]" />
              </div>
              <p className="text-sm font-bold">0% Completed</p>
            </div>
          </header>
          
          {/* 9x9 격자판이 들어갈 자리 */}
          <div className="aspect-square bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner flex flex-col items-center justify-center gap-2 p-8 text-center">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
               <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
            </div>
            <p className="text-gray-400 font-medium text-sm">격자판을 구성하는 중입니다...</p>
          </div>
        </main>
      )}
    </div>
  );
}