import { Link, Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const FEATURES = [
  {
    title: '매일 면접 질문 배달',
    description: '설정한 시간에 맞춤 면접 질문을 이메일로 보내드립니다. 매일 꾸준히 준비하세요.',
    icon: '✉️',
  },
  {
    title: 'AI 피드백',
    description: 'AI가 답변을 분석하고 완성도, 구조, 표현, 구체성 4가지 항목으로 피드백합니다.',
    icon: '🤖',
  },
  {
    title: 'GitHub 잔디 연동',
    description: '답변과 피드백이 자동으로 GitHub에 커밋되어 잔디에 반영됩니다.',
    icon: '🟩',
  },
  {
    title: '오답 노트 & 통계',
    description: '낮은 점수의 답변을 모아보고, 성장 추이를 한눈에 확인할 수 있습니다.',
    icon: '📊',
  },
];

const STEPS = [
  { step: '1', title: '질문 수신', description: '매일 설정한 시간에 이메일로 면접 질문을 받습니다.' },
  { step: '2', title: '답변 작성', description: '웹에서 편하게 답변을 작성하고 제출합니다.' },
  { step: '3', title: 'AI 피드백', description: 'AI가 즉시 분석하여 상세한 피드백과 모범 답변을 제공합니다.' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      {/* 히어로 */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            매일 한 문제,<br />
            <span className="text-indigo-900">꾸준한 면접 준비</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            하루한답은 매일 면접 질문을 보내고, AI가 답변을 분석해주는 개발자 면접 준비 서비스입니다.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-8 py-4 text-lg font-medium transition-colors"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* 핵심 기능 */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">핵심 기능</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ title, description, icon }) => (
              <div
                key={title}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 흐름 */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">이렇게 사용해요</h2>
          <div className="space-y-8">
            {STEPS.map(({ step, title, description }) => (
              <div key={step} className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold shrink-0">
                  {step}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">지금 바로 시작하세요</h2>
          <p className="text-gray-500 mb-8">매일 한 문제씩, 면접 실력을 키워보세요.</p>
          <Link
            to="/signup"
            className="inline-block bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-8 py-4 text-lg font-medium transition-colors"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
}
