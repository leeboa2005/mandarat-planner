import { supabase } from './supbase';

// 1. 만다라트 초기 데이터 생성 
export const createInitialMandalart = async (userId: string) => {
  // 9x9 격자를 위한 데이터 구조 (중앙 핵심목표 8개 + 각각의 세부목표들)
  const initialGoals = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    title: "", // 각 구역의 중심 목표
    sub_goals: Array.from({ length: 8 }, (_, j) => ({
      id: j,
      content: "",
      is_completed: false
    }))
  }));

  const { data, error } = await supabase
    .from('boards')
    .insert([
      { 
        user_id: userId, 
        title: "나의 첫 만다라트", 
        goals: initialGoals 
      }
    ])
    .select();

  if (error) throw error;
  return data[0];
};

// 2. 내 만다라트 불러오기
export const getMyMandalart = async (userId: string) => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // 데이터가 없는 경우 제외
  return data;
};