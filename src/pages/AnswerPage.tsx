import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { getQuestionByTokenAPI, submitAnswerAPI } from '../api/answer';
import type { Question } from '../types';

export default function AnswerPage() {
  const { answerToken } = useParams<{ answerToken: string }>();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [question, setQuestion] = useState<Question | null>(null);
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

    setError(null);
    setSubmitting(true);
    setSaved(false);
    try {
      const res = await submitAnswerAPI({ deliveryId: 1, content, isFinal });
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
        <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <p className="text-gray-500">질문을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const charCount = content.length;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* 질문 카드 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-indigo-50 text-indigo-900 text-xs font-medium px-3 py-1 rounded-full">
            {question.category}
          </span>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
            {question.difficulty}
          </span>
        </div>
        <p className="text-gray-900 text-lg leading-relaxed">{question.content}</p>
      </div>

      {/* 에러 / 저장 알림 */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-emerald-50 text-emerald-600 text-sm rounded-lg px-4 py-3 mb-4">
          임시 저장되었습니다.
        </div>
      )}

      {/* 답변 입력 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="답변을 작성해주세요..."
          className="w-full min-h-[300px] border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">200자 이상 권장</p>
          <p className={`text-sm font-medium ${charCount >= 200 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {charCount}자
          </p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          임시 저장
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={submitting}
          className="flex-1 bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '제출 중...' : '제출하기'}
        </button>
      </div>
    </div>
  );
}
