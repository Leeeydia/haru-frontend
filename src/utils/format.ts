export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function getScoreGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 70) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

export function getScoreColor(score: number): string {
  const grade = getScoreGrade(score);
  switch (grade) {
    case 'A':
      return 'text-emerald-600';
    case 'B':
      return 'text-indigo-700';
    case 'C':
      return 'text-amber-600';
    default:
      return 'text-red-600';
  }
}
