import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFeedbackAPI } from '../api/feedback';
import { addWrongNoteAPI } from '../api/wrongNote';
import { getScoreGrade } from '../utils/format';
import type { Feedback } from '../types';

const FEEDBACK_SECTIONS = [
  { key: 'completeness' as const, label: '내용 완성도', icon: 'check_circle' },
  { key: 'structure' as const, label: '답변 구조', icon: 'account_tree' },
  { key: 'expression' as const, label: '표현/말투', icon: 'record_voice_over' },
  { key: 'specificity' as const, label: '구체성', icon: 'target' },
];

export default function FeedbackPage() {
  const { answerId } = useParams<{ answerId: string }>();

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAnswer, setShowAnswer] = useState(false);
  const [showImproved, setShowImproved] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    completeness: true,
    structure: true,
    expression: true,
    specificity: true,
  });
  const [wrongNoteAdding, setWrongNoteAdding] = useState(false);
  const [wrongNoteMessage, setWrongNoteMessage] = useState('');

  useEffect(() => {
    if (!answerId) return;
    getFeedbackAPI(Number(answerId))
      .then((res) => {
        if (res.success && res.data) {
          setFeedback(res.data);
        } else {
          setError('피드백을 불러올 수 없습니다.');
        }
      })
      .catch(() => {
        setError('서버에 연결할 수 없습니다.');
      })
      .finally(() => setLoading(false));
  }, [answerId]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddWrongNote = async () => {
    if (!answerId) return;
    setWrongNoteAdding(true);
    setWrongNoteMessage('');
    try {
      const res = await addWrongNoteAPI(Number(answerId));
      if (res.success) {
        setWrongNoteMessage('오답 노트에 추가되었습니다.');
      } else {
        setWrongNoteMessage(res.message || '추가에 실패했습니다.');
      }
    } catch {
      setWrongNoteMessage('서버에 연결할 수 없습니다.');
    } finally {
      setWrongNoteAdding(false);
      setTimeout(() => setWrongNoteMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-6 text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">error_outline</span>
        <p className="text-on-surface-variant font-medium">{error || '피드백을 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  const grade = getScoreGrade(feedback.totalScore);

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      {/* Score card */}
      <div className="bg-primary text-on-primary rounded-xl p-8 text-center mb-6 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: '"FILL" 1' }}>
            grade
          </span>
        </div>
        <div className="relative z-10">
          <span className="text-on-primary/60 font-bold uppercase tracking-widest text-xs">
            Total Score
          </span>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-6xl font-headline font-extrabold tracking-tighter">
              {feedback.totalScore}
            </span>
            <span className="text-on-primary/40 text-2xl font-bold">/100</span>
          </div>
          <div className="mt-3">
            <span className="bg-on-primary/20 text-on-primary px-4 py-1 rounded-full text-sm font-bold">
              {grade}등급
            </span>
          </div>
        </div>
      </div>

      {/* My answer */}
      <div className="bg-surface-container-lowest rounded-xl mb-4 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">description</span>
            <span className="font-bold text-on-surface">내 답변 원문</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant transition-transform" style={{ transform: showAnswer ? 'rotate(180deg)' : 'none' }}>
            expand_more
          </span>
        </button>
        {showAnswer && (
          <div className="px-6 pb-6 border-t border-surface-container pt-4">
            <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {feedback.answerContent}
            </p>
          </div>
        )}
      </div>

      {/* Feedback sections */}
      <div className="space-y-3 mb-4">
        {FEEDBACK_SECTIONS.map(({ key, label, icon }) => (
          <div key={key} className="bg-surface-container-lowest rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">{icon}</span>
                <span className="font-bold text-on-surface">{label}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant transition-transform" style={{ transform: openSections[key] ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </button>
            {openSections[key] && (
              <div className="px-6 pb-6 border-t border-surface-container pt-4">
                <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                  {feedback[key]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Improved answer */}
      <div className="bg-surface-container-lowest rounded-xl mb-8 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowImproved(!showImproved)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <span className="font-bold text-on-surface">모범 답변 예시</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant transition-transform" style={{ transform: showImproved ? 'rotate(180deg)' : 'none' }}>
            expand_more
          </span>
        </button>
        {showImproved && (
          <div className="px-6 pb-6 border-t border-surface-container pt-4">
            <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {feedback.improvedAnswer}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to={`/answer/${feedback.answerToken}`}
          className="flex-1 text-center bg-surface-container-low text-on-surface-variant hover:bg-surface-container rounded-full px-6 py-3.5 font-bold transition-colors"
        >
          다시 작성하기
        </Link>
        <button
          onClick={handleAddWrongNote}
          disabled={wrongNoteAdding}
          className="flex-1 bg-surface-container-low text-on-surface-variant hover:bg-surface-container rounded-full px-6 py-3.5 font-bold transition-colors disabled:opacity-50"
        >
          {wrongNoteAdding ? '추가 중...' : '오답 노트에 추가'}
        </button>
        <Link
          to="/my/history"
          className="flex-1 text-center bg-primary text-on-primary rounded-full px-6 py-3.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          이력 보기
        </Link>
      </div>
      {wrongNoteMessage && (
        <p className={`text-sm mt-3 text-center font-medium ${wrongNoteMessage.includes('실패') || wrongNoteMessage.includes('연결') ? 'text-error' : 'text-green-600'}`}>
          {wrongNoteMessage}
        </p>
      )}
    </div>
  );
}
