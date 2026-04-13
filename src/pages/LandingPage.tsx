import { Link, Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const FEATURES = [
  {
    title: '매일 면접 질문 배달',
    description: '설정한 시간에 맞춤 면접 질문을 이메일로 보내드립니다. 매일 꾸준히 준비하세요.',
    icon: 'mail',
  },
  {
    title: 'AI 피드백',
    description: 'AI가 답변을 분석하고 완성도, 구조, 표현, 구체성 4가지 항목으로 피드백합니다.',
    icon: 'psychology',
  },
  {
    title: 'GitHub 잔디 연동',
    description: '답변과 피드백이 자동으로 GitHub에 커밋되어 잔디에 반영됩니다.',
    icon: 'grid_view',
  },
  {
    title: '오답 노트 & 통계',
    description: '낮은 점수의 답변을 모아보고, 성장 추이를 한눈에 확인할 수 있습니다.',
    icon: 'trending_up',
  },
];

const STEPS = [
  { step: '1', title: '질문 수신', description: '매일 설정한 시간에 이메일로 면접 질문을 받습니다.', icon: 'schedule' },
  { step: '2', title: '답변 작성', description: '웹에서 편하게 답변을 작성하고 제출합니다.', icon: 'edit_note' },
  { step: '3', title: 'AI 피드백', description: 'AI가 즉시 분석하여 상세한 피드백과 모범 답변을 제공합니다.', icon: 'auto_awesome' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary-container/20 text-on-secondary-container px-4 py-2 rounded-full text-sm font-bold mb-8">
            <span className="material-symbols-outlined text-base">local_fire_department</span>
            개발자 면접 준비의 새로운 방법
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-tight mb-6">
            매일 한 문제,
            <br />
            <span className="text-primary">꾸준한 면접 준비</span>
          </h1>
          <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto font-medium">
            하루한답은 매일 면접 질문을 보내고,
            <br />
            AI가 답변을 분석해주는 개발자 면접 준비 서비스입니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="bg-primary text-on-primary rounded-full px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              무료로 시작하기
            </Link>
            <Link
              to="/login"
              className="text-primary font-bold text-lg hover:text-primary-container transition-colors"
            >
              이미 계정이 있으신가요?
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-primary mb-3">
              핵심 기능
            </h2>
            <p className="text-on-surface-variant font-medium">
              체계적인 면접 준비를 위한 모든 것
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ title, description, icon }) => (
              <div
                key={title}
                className="bg-surface-container-lowest rounded-xl p-8 border-b-2 border-primary/5 hover:border-primary/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2">{title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-primary mb-3">
              이렇게 사용해요
            </h2>
            <p className="text-on-surface-variant font-medium">
              3단계로 간단하게 시작하세요
            </p>
          </div>
          <div className="space-y-8">
            {STEPS.map(({ step, title, description, icon }) => (
              <div key={step} className="flex items-start gap-6 bg-surface-container-lowest rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                      Step {step}
                    </span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-on-surface mb-1">{title}</h3>
                  <p className="text-on-surface-variant">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-primary rounded-2xl p-12 md:p-16 text-on-primary relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                rocket_launch
              </span>
            </div>
            <div className="relative z-10">
              <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-4">
                지금 바로 시작하세요
              </h2>
              <p className="text-on-primary/80 mb-8 font-medium">
                매일 한 문제씩, 면접 실력을 키워보세요.
              </p>
              <Link
                to="/signup"
                className="inline-block bg-on-primary text-primary rounded-full px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                무료로 시작하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
