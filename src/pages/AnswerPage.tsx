import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { getQuestionByTokenAPI, submitAnswerAPI } from '../api/answer';
import type { QuestionDetail } from '../types';

export default function AnswerPage() {
  const { answerToken } = useParams<{ answerToken: string }>();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [content, setContent] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!answerToken) return;
    setLoadingQuestion(true);
    getQuestionByTokenAPI(answerToken)
      .then((res) => {
        if (res.success && res.data) {
          setQuestion(res.data);
        } else {
          setError('질문을 불러올 수 없습니다.');
        }
      })
      .catch(() => {
        setError('서버에 연결할 수 없습니다.');
      })
      .finally(() => setLoadingQuestion(false));
  }, [answerToken]);

  const handleSubmit = async (isFinal: boolean) => {
    if (isFinal && !isAuthenticated) {
      const returnUrl = encodeURIComponent(location.pathname);
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }

    if (isFinal && content.trim().length === 0) {
      setError('답변을 입력해주세요.');
      return;
    }

    if (!question) return;

    setError(null);
    setSubmitting(true);
    setSaved(false);
    try {
      const res = await submitAnswerAPI({ deliveryId: question.deliveryId, content, isFinal });
      if (res.success && res.data) {
        if (isFinal) {
          navigate(`/feedback/${res.data.id}`);
        } else {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } else {
        setError(res.message || '저장에 실패했습니다.');
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-6 text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">error_outline</span>
        <p className="text-on-surface-variant font-medium">{error || '질문을 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  const charCount = content.length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      {/* Question card */}
      <div className="bg-primary text-on-primary rounded-xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: '"FILL" 1' }}>
            quiz
          </span>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-on-primary/20 text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">
              {question.category}
            </span>
            <span className="bg-on-primary/20 text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">
              {question.difficulty}
            </span>
          </div>
          <p className="text-on-primary text-lg leading-relaxed font-medium">{question.content}</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-error/10 text-error text-sm rounded-lg px-4 py-3 mb-4 font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-green-600/10 text-green-700 text-sm rounded-lg px-4 py-3 mb-4 font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          임시 저장되었습니다.
        </div>
      )}

      {/* Answer editor */}
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-on-surface">답변 작성</span>
          <span className={`text-sm font-bold ${charCount >= 200 ? 'text-green-600' : 'text-on-surface-variant/50'}`}>
            {charCount}자
          </span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="답변을 작성해주세요..."
          className="w-full min-h-[300px] bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y transition-colors"
        />
        <div className="flex items-center gap-2 mt-3">
          <span className="material-symbols-outlined text-sm text-on-surface-variant/50">info</span>
          <p className="text-sm text-on-surface-variant/50">200자 이상 권장</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="flex-1 bg-surface-container-low text-on-surface-variant hover:bg-surface-container rounded-full px-6 py-3.5 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          임시 저장
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={submitting}
          className="flex-1 bg-primary text-on-primary rounded-full px-6 py-3.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '제출 중...' : '제출하기'}
        </button>
      </div>
    </div>
  );
}
