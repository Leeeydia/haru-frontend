import { Link } from 'react-router-dom';

const FLOW_STEPS = [
  { icon: 'mail', label: '질문 수신', desc: '매일 설정한 시간에 면접 질문이 이메일로 도착합니다.' },
  { icon: 'edit_note', label: '답변 작성', desc: '웹에서 편하게 답변을 작성하고 임시저장할 수 있습니다.' },
  { icon: 'psychology', label: 'AI 피드백', desc: 'AI가 답변을 분석해 항목별 피드백과 모범 답변을 제공합니다.' },
  { icon: 'commit', label: 'GitHub 커밋', desc: '답변과 피드백이 자동 커밋되어 잔디에 반영됩니다.' },
];

const FEATURES = [
  { icon: 'auto_awesome', title: 'AI 피드백', desc: '내용 완성도, 구조, 표현, 구체성을 항목별로 분석합니다.' },
  { icon: 'local_fire_department', title: '연속 답변 스트릭', desc: '매일 꾸준히 답변하며 성장을 시각화합니다.' },
  { icon: 'note_alt', title: '오답 노트', desc: '부족했던 답변을 모아 반복 학습할 수 있습니다.' },
  { icon: 'bar_chart', title: '성장 통계', desc: '카테고리별 점수 추이와 성장 그래프를 확인합니다.' },
  { icon: 'code', title: 'GitHub 잔디', desc: '답변이 자동 커밋되어 꾸준함이 프로필에 드러납니다.' },
  { icon: 'schedule', title: '맞춤 설정', desc: '수신 시간, 직군, 기술 스택에 맞춘 질문을 받습니다.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      {/* Hero */}
      <section className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-secondary-container/15 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
            menu_book
          </span>
          About
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
          하루한답
        </h1>
        <p className="text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          매일 한 문제, AI와 함께하는 개발자 면접 준비 서비스
        </p>
      </section>

      {/* Target */}
      <section className="mb-20">
        <h2 className="font-headline text-2xl font-bold text-primary mb-6 text-center">이런 분들을 위해 만들었습니다</h2>
        <div className="bg-surface-container-lowest rounded-xl p-8">
          <ul className="space-y-4">
            {[
              '기술 면접을 체계적으로 준비하고 싶은 개발자',
              '매일 꾸준히 학습하는 습관을 만들고 싶은 취준생',
              '내 답변에 객관적인 피드백을 받고 싶은 분',
              'GitHub 잔디를 채우며 동기부여를 얻고 싶은 분',
            ].map((text) => (
              <li key={text} className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-primary text-lg mt-0.5"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  check_circle
                </span>
                <span className="text-on-surface font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Flow */}
      <section className="mb-20">
        <h2 className="font-headline text-2xl font-bold text-primary mb-8 text-center">서비스 흐름</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} className="relative text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                  {step.icon}
                </span>
              </div>
              <div className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-1">
                Step {i + 1}
              </div>
              <h3 className="font-bold text-on-surface mb-1">{step.label}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
              {i < FLOW_STEPS.length - 1 && (
                <span className="hidden md:block absolute top-8 -right-3 material-symbols-outlined text-on-surface-variant/30 text-xl">
                  arrow_forward
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-20">
        <h2 className="font-headline text-2xl font-bold text-primary mb-8 text-center">주요 기능</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-surface-container-lowest rounded-xl p-6 border-b-2 border-primary/5">
              <span
                className="material-symbols-outlined text-primary text-2xl mb-3 block"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                {f.icon}
              </span>
              <h3 className="font-bold text-on-surface mb-1">{f.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="bg-primary rounded-xl p-10 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <span className="material-symbols-outlined text-[140px]" style={{ fontVariationSettings: '"FILL" 1' }}>
              rocket_launch
            </span>
          </div>
          <div className="relative z-10">
            <h2 className="font-headline text-2xl font-extrabold text-on-primary mb-2">
              지금 시작해보세요
            </h2>
            <p className="text-on-primary/70 mb-6">매일 한 문제로 면접 자신감을 키워보세요.</p>
            <Link
              to="/signup"
              className="inline-block bg-on-primary text-primary rounded-full px-8 py-3.5 font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
