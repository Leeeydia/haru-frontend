import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfileAPI } from '../api/profile';

const JOB_CATEGORIES = ['프론트엔드', '백엔드', '풀스택'] as const;

const TECH_STACKS_BY_JOB: Record<string, string[]> = {
  프론트엔드: ['React', 'TypeScript', 'JavaScript', 'Vue', 'Angular', 'Next.js', 'HTML/CSS', 'Tailwind CSS'],
  백엔드: ['Java', 'Spring', 'Node.js', 'Python', 'Django', 'Go', 'MySQL', 'PostgreSQL', 'Redis', 'Docker'],
  풀스택: ['React', 'TypeScript', 'Node.js', 'Java', 'Spring', 'Next.js', 'MySQL', 'PostgreSQL', 'Docker', 'AWS'],
};

const RECEIVE_HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [jobCategory, setJobCategory] = useState('');
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [receiveTime, setReceiveTime] = useState(9);
  const [dailyQuestionCount, setDailyQuestionCount] = useState(1);
  const [receiveDays, setReceiveDays] = useState('EVERYDAY');

  const toggleStack = (stack: string) => {
    setTechStacks((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack],
    );
  };

  const handleNext = () => {
    if (step === 1 && !jobCategory) return;
    if (step === 2 && techStacks.length === 0) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await saveProfileAPI({ jobCategory, techStacks, receiveTime, dailyQuestionCount, receiveDays, reminderEnabled: true });
      if (res.data.success) {
        navigate('/dashboard');
      } else {
        setError(res.data.message || '프로필 저장에 실패했습니다.');
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                  s <= step ? 'bg-indigo-900 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 ${s < step ? 'bg-indigo-900' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* 스텝 1: 직군 선택 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">직군을 선택하세요</h2>
              <p className="text-gray-500 text-sm mb-6">선택한 직군에 맞는 면접 질문을 보내드립니다.</p>
              <div className="space-y-3">
                {JOB_CATEGORIES.map((job) => (
                  <button
                    key={job}
                    type="button"
                    onClick={() => setJobCategory(job)}
                    className={`w-full text-left rounded-lg border-2 px-5 py-4 font-medium transition-colors ${
                      jobCategory === job
                        ? 'border-indigo-900 bg-indigo-50 text-indigo-900'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {job}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                disabled={!jobCategory}
                className="w-full mt-8 bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}

          {/* 스텝 2: 기술스택 선택 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">기술 스택을 선택하세요</h2>
              <p className="text-gray-500 text-sm mb-6">1개 이상 선택해주세요. 관련 질문을 우선 제공합니다.</p>
              <div className="flex flex-wrap gap-2">
                {(TECH_STACKS_BY_JOB[jobCategory] || []).map((stack) => (
                  <button
                    key={stack}
                    type="button"
                    onClick={() => toggleStack(stack)}
                    className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                      techStacks.includes(stack)
                        ? 'bg-indigo-900 text-white border-indigo-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {stack}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-6 py-3 font-medium transition-colors"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={techStacks.length === 0}
                  className="flex-1 bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* 스텝 3: 수신 설정 */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-gray-900 mb-2">질문 수신 설정</h2>
              <p className="text-gray-500 text-sm mb-6">원하는 시간에 면접 질문을 보내드립니다.</p>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              {/* 수신 시간 */}
              <div className="mb-6">
                <label htmlFor="receiveTime" className="block text-sm font-medium text-gray-700 mb-2">
                  수신 시간
                </label>
                <select
                  id="receiveTime"
                  value={receiveTime}
                  onChange={(e) => setReceiveTime(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value={-1}>테스트용 (매시간 발송)</option>
                  {RECEIVE_HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h}시
                    </option>
                  ))}
                </select>
              </div>

              {/* 일일 질문 수 */}
              <div className="mb-6">
                <span className="block text-sm font-medium text-gray-700 mb-2">일일 질문 수</span>
                <div className="flex gap-3">
                  {[1, 2, 3].map((n) => (
                    <label
                      key={n}
                      className={`flex-1 text-center rounded-lg border-2 px-4 py-3 cursor-pointer font-medium transition-colors ${
                        dailyQuestionCount === n
                          ? 'border-indigo-900 bg-indigo-50 text-indigo-900'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="dailyQuestionCount"
                        value={n}
                        checked={dailyQuestionCount === n}
                        onChange={() => setDailyQuestionCount(n)}
                        className="sr-only"
                      />
                      {n}개
                    </label>
                  ))}
                </div>
              </div>

              {/* 수신 요일 */}
              <div className="mb-8">
                <span className="block text-sm font-medium text-gray-700 mb-2">수신 요일</span>
                <div className="flex gap-3">
                  {[
                    { value: 'EVERYDAY', label: '매일' },
                    { value: 'WEEKDAY', label: '평일만' },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className={`flex-1 text-center rounded-lg border-2 px-4 py-3 cursor-pointer font-medium transition-colors ${
                        receiveDays === value
                          ? 'border-indigo-900 bg-indigo-50 text-indigo-900'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="receiveDays"
                        value={value}
                        checked={receiveDays === value}
                        onChange={() => setReceiveDays(value)}
                        className="sr-only"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-6 py-3 font-medium transition-colors"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '저장 중...' : '시작하기'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
