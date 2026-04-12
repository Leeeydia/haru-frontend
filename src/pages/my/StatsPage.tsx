import { useState, useEffect } from 'react';
import { getStatsAPI } from '../../api/stats';
import { getScoreColor } from '../../utils/format';
import type { StatsResponse, DailyActivity, WeeklyTrend } from '../../types';

// ─── 카테고리 색상 매핑 ─────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  프론트엔드: '#4338CA',
  백엔드: '#059669',
  풀스택: '#D97706',
  CS: '#DC2626',
  네트워크: '#7C3AED',
  데이터베이스: '#0891B2',
  운영체제: '#BE185D',
  자료구조: '#EA580C',
  알고리즘: '#4F46E5',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#6B7280';
}

// ─── 잔디 히트맵 ────────────────────────────────────────
function Heatmap({ dailyActivities }: { dailyActivities: DailyActivity[] }) {
  const activityMap = new Map(dailyActivities.map((d) => [d.date, d.count]));

  const today = new Date();
  // 일요일 시작으로 맞추기 위해 365일 + 오늘 요일 수만큼
  const totalDays = 365 + today.getDay();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays + 1);

  const weeks: { date: Date; count: number }[][] = [];
  let currentWeek: { date: Date; count: number }[] = [];

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const count = activityMap.get(key) ?? 0;

    if (d.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push({ date: d, count });
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getLevel = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-emerald-200';
    if (count === 2) return 'bg-emerald-400';
    return 'bg-emerald-600';
  };

  const months = (() => {
    const result: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const d = week[0].date;
      const m = d.getMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        result.push({ label: `${m + 1}월`, col: wi });
      }
    });
    return result;
  })();

  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  return (
    <div className="relative">
      {/* 월 라벨 */}
      <div className="flex mb-1 ml-0" style={{ gap: 0 }}>
        {months.map(({ label, col }, i) => {
          const nextCol = i + 1 < months.length ? months[i + 1].col : weeks.length;
          const span = nextCol - col;
          return (
            <span
              key={`${label}-${col}`}
              className="text-xs text-gray-400"
              style={{ width: span * 15, flexShrink: 0 }}
            >
              {label}
            </span>
          );
        })}
      </div>
      {/* 격자 */}
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }, (_, di) => {
              const cell = week[di];
              if (!cell) return <div key={di} className="w-[12px] h-[12px]" />;
              const dateStr = cell.date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              return (
                <div
                  key={di}
                  className={`w-[12px] h-[12px] rounded-sm ${getLevel(cell.count)} cursor-default`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parentRect = e.currentTarget.closest('.relative')!.getBoundingClientRect();
                    setTooltip({
                      x: rect.left - parentRect.left + 6,
                      y: rect.top - parentRect.top - 32,
                      text: `${dateStr} — ${cell.count}개`,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </div>
        ))}
      </div>
      {/* 범례 */}
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
        <span>적음</span>
        <div className="w-[12px] h-[12px] rounded-sm bg-gray-100" />
        <div className="w-[12px] h-[12px] rounded-sm bg-emerald-200" />
        <div className="w-[12px] h-[12px] rounded-sm bg-emerald-400" />
        <div className="w-[12px] h-[12px] rounded-sm bg-emerald-600" />
        <span>많음</span>
      </div>
      {/* 툴팁 */}
      {tooltip && (
        <div
          className="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

// ─── 카테고리 막대 그래프 ─────────────────────────────────
function CategoryBarChart({
  categoryStats,
  strongestCategory,
  weakestCategory,
}: {
  categoryStats: StatsResponse['categoryStats'];
  strongestCategory: string | null;
  weakestCategory: string | null;
}) {
  if (categoryStats.length === 0) return null;
  const maxScore = 100;

  return (
    <div className="space-y-3">
      {categoryStats.map(({ category, answerCount, averageScore }) => {
        const isStrong = category === strongestCategory;
        const isWeak = category === weakestCategory;
        return (
          <div key={category}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{category}</span>
                {isStrong && (
                  <span className="text-xs bg-emerald-50 text-emerald-600 font-medium px-1.5 py-0.5 rounded">
                    강점
                  </span>
                )}
                {isWeak && (
                  <span className="text-xs bg-red-50 text-red-600 font-medium px-1.5 py-0.5 rounded">
                    약점
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">{answerCount}개</span>
                <span className={`font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore.toFixed(1)}점
                </span>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(averageScore / maxScore) * 100}%`,
                  backgroundColor: getCategoryColor(category),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── 주간 점수 추이 꺾은선 그래프 ────────────────────────
function WeeklyChart({ weeklyTrends }: { weeklyTrends: WeeklyTrend[] }) {
  if (weeklyTrends.length === 0) return null;

  // 주차별로 그룹핑
  const weekStarts = [...new Set(weeklyTrends.map((w) => w.weekStart))].sort();
  const categories = [...new Set(weeklyTrends.map((w) => w.category))];

  // 카테고리별 데이터 시리즈 구성
  const series = categories.map((cat) => {
    const points = weekStarts.map((ws) => {
      const found = weeklyTrends.find((w) => w.weekStart === ws && w.category === cat);
      return found ? found.averageScore : null;
    });
    return { category: cat, points };
  });

  const W = 600;
  const H = 240;
  const padL = 40;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const stepX = weekStarts.length > 1 ? chartW / (weekStarts.length - 1) : 0;

  const [hovered, setHovered] = useState<{ weekIdx: number; x: number; y: number } | null>(null);

  const formatWeekLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseLeave={() => setHovered(null)}
      >
        {/* Y축 그리드 */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = padT + chartH - (v / 100) * chartH;
          return (
            <g key={v}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#E5E7EB" strokeWidth="1" />
              <text x={padL - 8} y={y + 4} textAnchor="end" className="text-[11px]" fill="#9CA3AF">
                {v}
              </text>
            </g>
          );
        })}
        {/* X축 라벨 */}
        {weekStarts.map((ws, i) => {
          const x = padL + i * stepX;
          return (
            <text
              key={ws}
              x={x}
              y={H - 8}
              textAnchor="middle"
              className="text-[11px]"
              fill="#9CA3AF"
            >
              {formatWeekLabel(ws)}
            </text>
          );
        })}
        {/* 데이터 라인 */}
        {series.map(({ category, points }) => {
          const color = getCategoryColor(category);
          const segments: string[] = [];
          points.forEach((p, i) => {
            if (p === null) return;
            const x = padL + i * stepX;
            const y = padT + chartH - (p / 100) * chartH;
            segments.push(`${segments.length === 0 ? 'M' : 'L'}${x},${y}`);
          });
          if (segments.length === 0) return null;
          return (
            <g key={category}>
              <path d={segments.join(' ')} fill="none" stroke={color} strokeWidth="2" />
              {points.map((p, i) => {
                if (p === null) return null;
                const x = padL + i * stepX;
                const y = padT + chartH - (p / 100) * chartH;
                return <circle key={i} cx={x} cy={y} r="3.5" fill={color} />;
              })}
            </g>
          );
        })}
        {/* 호버 영역 */}
        {weekStarts.map((_, i) => {
          const x = padL + i * stepX;
          return (
            <rect
              key={i}
              x={x - (stepX / 2 || 20)}
              y={padT}
              width={stepX || 40}
              height={chartH}
              fill="transparent"
              onMouseEnter={(e) => {
                const svg = e.currentTarget.ownerSVGElement!;
                const pt = svg.createSVGPoint();
                pt.x = e.clientX;
                pt.y = e.clientY;
                const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
                setHovered({ weekIdx: i, x: svgPt.x, y: padT });
              }}
            />
          );
        })}
        {/* 호버 라인 + 툴팁 */}
        {hovered && (
          <>
            <line
              x1={padL + hovered.weekIdx * stepX}
              y1={padT}
              x2={padL + hovered.weekIdx * stepX}
              y2={padT + chartH}
              stroke="#9CA3AF"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            {series.map(({ category, points }) => {
              const p = points[hovered.weekIdx];
              if (p === null) return null;
              const x = padL + hovered.weekIdx * stepX;
              const y = padT + chartH - (p / 100) * chartH;
              return (
                <g key={category}>
                  <circle cx={x} cy={y} r="5" fill={getCategoryColor(category)} stroke="white" strokeWidth="2" />
                  <text
                    x={x + 8}
                    y={y - 6}
                    className="text-[10px]"
                    fill={getCategoryColor(category)}
                    fontWeight="bold"
                  >
                    {p.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </>
        )}
      </svg>
      {/* 범례 */}
      <div className="flex flex-wrap gap-3 mt-2">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(cat) }} />
            <span className="text-xs text-gray-600">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 메인 페이지 ────────────────────────────────────────
export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStatsAPI()
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setError('통계를 불러올 수 없습니다.');
        }
      })
      .catch(() => {
        setError('서버에 연결할 수 없습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <p className="text-gray-500">{error || '통계를 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  const isEmpty = stats.totalAnswerCount === 0;

  const summaryCards = [
    { label: '총 답변 수', value: `${stats.totalAnswerCount}개` },
    { label: '평균 점수', value: stats.averageScore > 0 ? `${stats.averageScore.toFixed(1)}점` : '-' },
    { label: '현재 스트릭', value: `${stats.currentStreak}일` },
    { label: '최대 스트릭', value: `${stats.maxStreak}일` },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">성장 통계</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center"
          >
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-indigo-900">{value}</p>
          </div>
        ))}
      </div>

      {isEmpty ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-lg">아직 답변 데이터가 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">
            질문에 답변을 작성하면 성장 통계가 표시됩니다.
          </p>
        </div>
      ) : (
        <>
          {/* 잔디 히트맵 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">답변 활동</h2>
            <Heatmap dailyActivities={stats.dailyActivities} />
          </section>

          {/* 카테고리별 막대 그래프 */}
          {stats.categoryStats.length > 0 && (
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">카테고리별 성적</h2>
              <CategoryBarChart
                categoryStats={stats.categoryStats}
                strongestCategory={stats.strongestCategory}
                weakestCategory={stats.weakestCategory}
              />
            </section>
          )}

          {/* 주간 점수 추이 */}
          {stats.weeklyTrends.length > 0 && (
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">주간 점수 추이</h2>
              <WeeklyChart weeklyTrends={stats.weeklyTrends} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
