import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { saveProfileAPI } from '../api/profile';

const JOB_CATEGORIES = ['프론트엔드', '백엔드', '풀스택'] as const;

const JOB_ICONS: Record<string, string> = {
  프론트엔드: 'web',
  백엔드: 'dns',
  풀스택: 'layers',
};

const TECH_STACKS_BY_JOB: Record<string, string[]> = {
  프론트엔드: ['React', 'TypeScript', 'JavaScript', 'Vue', 'Angular', 'Next.js', 'HTML/CSS', 'Tailwind CSS'],
  백엔드: ['Java', 'Spring', 'Node.js', 'Python', 'Django', 'Go', 'MySQL', 'PostgreSQL', 'Redis', 'Docker'],
  풀스택: ['React', 'TypeScript', 'Node.js', 'Java', 'Spring', 'Next.js', 'MySQL', 'PostgreSQL', 'Docker', 'AWS'],
};

const RECEIVE_HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

const STEP_LABELS = ['직군 선택', '기술 스택', '수신 설정'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setOnboardingCompleted } = useAuthContext();
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
        setOnboardingCompleted();
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
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    s <= step
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {s < step ? (
                    <span className="material-symbols-outlined text-lg">check</span>
                  ) : (
                    s
                  )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  s <= step ? 'text-primary' : 'text-on-surface-variant/50'
                }`}>
                  {STEP_LABELS[s - 1]}
                </span>
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 rounded-full mb-5 ${s < step ? 'bg-primary' : 'bg-surface-container'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8">
          {/* Step 1: Job category */}
          {step === 1 && (
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface mb-2">직군을 선택하세요</h2>
              <p className="text-on-surface-variant text-sm mb-6">선택한 직군에 맞는 면접 질문을 보내드립니다.</p>
              <div className="space-y-3">
                {JOB_CATEGORIES.map((job) => (
                  <button
                    key={job}
                    type="button"
                    onClick={() => setJobCategory(job)}
                    className={`w-full flex items-center gap-4 text-left rounded-xl border-2 px-5 py-4 font-medium transition-all ${
                      jobCategory === job
                        ? 'border-primary bg-secondary-container/10 text-primary'
                        : 'border-surface-container text-on-surface hover:border-outline-variant'
                    }`}
                  >
                    <span className={`material-symbols-outlined ${jobCategory === job ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {JOB_ICONS[job]}
                    </span>
                    {job}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                disabled={!jobCategory}
                className="w-full mt-8 bg-primary text-on-primary rounded-full px-6 py-3.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}

          {/* Step 2: Tech stacks */}
          {step === 2 && (
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface mb-2">기술 스택을 선택하세요</h2>
              <p className="text-on-surface-variant text-sm mb-6">1개 이상 선택해주세요. 관련 질문을 우선 제공합니다.</p>
              <div className="flex flex-wrap gap-2">
                {(TECH_STACKS_BY_JOB[jobCategory] || []).map((stack) => (
                  <button
                    key={stack}
                    type="button"
                    onClick={() => toggleStack(stack)}
                    className={`rounded-full px-4 py-2 text-sm font-bold border transition-all active:scale-95 ${
                      techStacks.includes(stack)
                        ? 'bg-primary text-on-primary border-primary shadow-md'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-outline'
                    }`}
                  >
                    {stack}
                  </button>
                ))}
              </div>
              {techStacks.length > 0 && (
                <p className="text-sm text-primary font-bold mt-4">
                  {techStacks.length}개 선택됨
                </p>
              )}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-surface-container-low text-on-surface-variant hover:bg-surface-container rounded-full px-6 py-3.5 font-bold transition-colors"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={techStacks.length === 0}
                  className="flex-1 bg-primary text-on-primary rounded-full px-6 py-3.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Receive settings */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="font-headline text-xl font-bold text-on-surface mb-2">질문 수신 설정</h2>
              <p className="text-on-surface-variant text-sm mb-6">원하는 시간에 면접 질문을 보내드립니다.</p>

              {error && (
                <div className="bg-error/10 text-error text-sm rounded-lg px-4 py-3 mb-6 font-medium">
                  {error}
                </div>
              )}

              {/* Receive time */}
              <div className="mb-6">
                <label htmlFor="receiveTime" className="block text-sm font-semibold text-on-surface mb-2">
                  수신 시간
                </label>
                <select
                  id="receiveTime"
                  value={receiveTime}
                  onChange={(e) => setReceiveTime(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                >
                  <option value={-1}>테스트용 (매시간 발송)</option>
                  {RECEIVE_HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h}시
                    </option>
                  ))}
                </select>
              </div>

              {/* Daily question count */}
              <div className="mb-6">
                <span className="block text-sm font-semibold text-on-surface mb-2">일일 질문 수</span>
                <div className="flex gap-3">
                  {[1, 2, 3].map((n) => (
                    <label
                      key={n}
                      className={`flex-1 text-center rounded-xl border-2 px-4 py-3 cursor-pointer font-bold transition-all ${
                        dailyQuestionCount === n
                          ? 'border-primary bg-secondary-container/10 text-primary'
                          : 'border-surface-container text-on-surface-variant hover:border-outline-variant'
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

              {/* Receive days */}
              <div className="mb-8">
                <span className="block text-sm font-semibold text-on-surface mb-2">수신 요일</span>
                <div className="flex gap-3">
                  {[
                    { value: 'EVERYDAY', label: '매일' },
                    { value: 'WEEKDAY', label: '평일만' },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className={`flex-1 text-center rounded-xl border-2 px-4 py-3 cursor-pointer font-bold transition-all ${
                        receiveDays === value
                          ? 'border-primary bg-secondary-container/10 text-primary'
                          : 'border-surface-container text-on-surface-variant hover:border-outline-variant'
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
                  className="flex-1 bg-surface-container-low text-on-surface-variant hover:bg-surface-container rounded-full px-6 py-3.5 font-bold transition-colors"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-on-primary rounded-full px-6 py-3.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
