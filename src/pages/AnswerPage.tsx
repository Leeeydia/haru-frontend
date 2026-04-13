import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { getQuestionByTokenAPI, getAnswersByDeliveryAPI, submitAnswerAPI } from '../api/answer';
import type { QuestionDetail } from '../types';

const ANALYSIS_MESSAGES = [
  'AI가 답변을 분석하고 있습니다',
  '완성도를 평가하고 있습니다',
  '답변 구조를 검토하고 있습니다',
  '모범 답변을 생성하고 있습니다',
];

function AnalyzingModal() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % ANALYSIS_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/60 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-2xl p-10 max-w-sm w-full mx-6 text-center shadow-xl">
        {/* Animated icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-surface-container" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary text-2xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              psychology
            </span>
          </div>
        </div>

        <p className="font-headline text-lg font-bold text-on-surface mb-2">
          {ANALYSIS_MESSAGES[msgIndex]}
        </p>
        <p className="text-sm text-on-surface-variant">
          잠시만 기다려주세요. 곧 결과를 보여드릴게요.
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnswerPage() {
  const { answerToken } = useParams<{ answerToken: string }>();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [content, setContent] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!answerToken) return;
    setLoadingQuestion(true);
    getQuestionByTokenAPI(answerToken)
      .then(async (res) => {
        if (res.success && res.data) {
          setQuestion(res.data);
          // 임시저장된 답변이 있으면 불러오기
          if (isAuthenticated) {
            try {
              const draftRes = await getAnswersByDeliveryAPI(res.data.deliveryId);
              if (draftRes.success && draftRes.data && draftRes.data.length > 0) {
                // 최신 답변이 임시저장이면 복원
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const latest = draftRes.data[draftRes.data.length - 1] as any;
                const isFinal = latest.isFinal ?? latest.final ?? false;
                if (!isFinal && latest.content) {
                  setContent(latest.content);
                }
              }
            } catch {
              // 임시저장 답변이 없으면 무시
            }
          }
        } else {
          setError('질문을 불러올 수 없습니다.');
        }
      })
      .catch(() => {
        setError('서버에 연결할 수 없습니다.');
      })
      .finally(() => setLoadingQuestion(false));
  }, [answerToken, isAuthenticated]);

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
    setSaved(false);

    if (isFinal) {
      setAnalyzing(true);
    } else {
      setSubmitting(true);
    }

    try {
      const res = await submitAnswerAPI({ deliveryId: question.deliveryId, content, isFinal });
      if (res.success && res.data) {
        if (isFinal) {
          setContent('');
          navigate(`/feedback/${res.data.id}`);
        } else {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } else {
        setError(res.message || '저장에 실패했습니다.');
        setAnalyzing(false);
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
      setAnalyzing(false);
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
  const isDisabled = submitting || analyzing;

  return (
    <>
      {analyzing && <AnalyzingModal />}

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
            disabled={isDisabled}
            className="w-full min-h-[300px] bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y transition-colors disabled:opacity-50"
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
            disabled={isDisabled}
            className="flex-1 bg-surface-container-low text-on-surface-variant hover:bg-surface-container rounded-full px-6 py-3.5 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            임시 저장
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isDisabled}
            className="flex-1 bg-primary text-on-primary rounded-full px-6 py-3.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            제출하기
          </button>
        </div>
      </div>
    </>
  );
}
