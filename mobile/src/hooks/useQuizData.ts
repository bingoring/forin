// Fetches a quiz's playable content (api.quiz) with loading/error/ok state.
import { useEffect, useState } from 'react';
import { api, type QuizDetail } from '@/api/client';

export function useQuizData(id: string) {
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');

  useEffect(() => {
    let alive = true;
    setState('loading');
    api
      .quiz(id)
      .then((q) => { if (alive) { setQuiz(q); setState('ok'); } })
      .catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
  }, [id]);

  return { quiz, state };
}
