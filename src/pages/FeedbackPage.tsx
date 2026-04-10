import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFeedbackAPI } from '../api/feedback';
import { getScoreGrade, getScoreColor } from '../utils/format';
import type { Feedback } from '../types';

const FEEDBACK_SECTIONS = [
  { key: 'completeness' as const, label: '내용 완성도' },
  { key: 'structure' as const, label: '답변 구조' },
  { key: 'expression' as const, label: '표현/말투' },
  { key: 'specificity' as const, label: '구체성' },
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
      .finally(() => setLoading(false));
  }, [answerId]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <p className="text-gray-500">{error || '피드백을 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  const grade = getScoreGrade(feedback.totalScore);
  const scoreColor = getScoreColor(feedback.totalScore);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* 종합 점수 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-6">
        <p className="text-gray-500 text-sm mb-2">종합 점수</p>
        <div className="flex items-center justify-center gap-4">
          <span className={`text-5xl font-bold ${scoreColor}`}>{feedback.totalScore}</span>
          <span className="text-gray-400 text-2xl">/</span>
          <span className="text-gray-400 text-2xl">100</span>
        </div>
        <div className={`inline-block mt-3 text-2xl font-bold ${scoreColor}`}>
          {grade}등급
        </div>
      </div>

      {/* 내 답변 원문 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <button
          type="button"
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full flex items-center justify-between px-6 py-4 text-left"
        >
          <span className="font-medium text-gray-900">내 답변 원문</span>
          <span className="text-gray-400 text-sm">{showAnswer ? '접기' : '펼치기'}</span>
        </button>
        {showAnswer && (
          <div className="px-6 pb-6 border-t border-gray-100 pt-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              (제출한 답변이 여기에 표시됩니다.)
            </p>
          </div>
        )}
      </div>

      {/* 항목별 피드백 */}
      <div className="space-y-4 mb-6">
        {FEEDBACK_SECTIONS.map(({ key, label }) => (
          <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <button
              type="button"
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-medium text-gray-900">{label}</span>
              <span className="text-gray-400 text-sm">{openSections[key] ? '접기' : '펼치기'}</span>
            </button>
            {openSections[key] && (
              <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {feedback[key]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 모범 답변 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <button
          type="button"
          onClick={() => setShowImproved(!showImproved)}
          className="w-full flex items-center justify-between px-6 py-4 text-left"
        >
          <span className="font-medium text-gray-900">모범 답변 예시</span>
          <span className="text-gray-400 text-sm">{showImproved ? '접기' : '펼치기'}</span>
        </button>
        {showImproved && (
          <div className="px-6 pb-6 border-t border-gray-100 pt-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {feedback.improvedAnswer}
            </p>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3">
        <Link
          to={`/answer/retry`}
          className="flex-1 text-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-6 py-3 font-medium transition-colors"
        >
          다시 작성하기
        </Link>
        <Link
          to="/my/history"
          className="flex-1 text-center bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium transition-colors"
        >
          이력 보기
        </Link>
      </div>
    </div>
  );
}
