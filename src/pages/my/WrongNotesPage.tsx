import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWrongNotesAPI, deleteWrongNoteAPI } from '../../api/wrongNote';
import { getScoreColor } from '../../utils/format';
import type { WrongNote } from '../../types';

export default function WrongNotesPage() {
  const [notes, setNotes] = useState<WrongNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getWrongNotesAPI()
      .then((res) => {
        if (res.success && res.data) {
          setNotes(res.data);
        } else {
          setError('오답 노트를 불러올 수 없습니다.');
        }
      })
      .catch(() => {
        setError('서버에 연결할 수 없습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('이 오답 노트를 삭제하시겠습니까?')) return;
    setDeletingId(id);
    try {
      const res = await deleteWrongNoteAPI(id);
      if (res.success) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {
      // 삭제 실패 시 무시
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">오답 노트</h1>
        <span className="text-sm text-gray-500">{notes.length}개</span>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-lg">오답 노트가 비어있습니다.</p>
          <p className="text-gray-400 text-sm mt-2">
            피드백 페이지에서 오답 노트에 추가하거나, 점수가 50점 미만이면 자동으로 추가됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                {/* 질문 정보 */}
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 font-medium leading-snug">
                    {note.questionContent.length > 80
                      ? note.questionContent.slice(0, 80) + '...'
                      : note.questionContent}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-indigo-50 text-indigo-900 text-xs font-medium px-2 py-0.5 rounded-full">
                      {note.category}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {note.difficulty}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        note.addedType === 'AUTO'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {note.addedType === 'AUTO' ? '자동 추가' : '수동 추가'}
                    </span>
                  </div>
                </div>

                {/* 점수 */}
                {note.totalScore !== null && (
                  <div className="text-right shrink-0">
                    <span className={`text-lg font-bold ${getScoreColor(note.totalScore)}`}>
                      {note.totalScore}점
                    </span>
                  </div>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/feedback/${note.answerId}`}
                  className="bg-indigo-900 hover:bg-indigo-700 text-white text-sm rounded-lg px-4 py-2 font-medium transition-colors"
                >
                  재도전
                </Link>
                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={deletingId === note.id}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-50"
                >
                  {deletingId === note.id ? '삭제 중...' : '해결 완료'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
