import client from './client';
import type { ApiResponse, WrongNote } from '../types';

export async function getWrongNotesAPI() {
  const res = await client.get<ApiResponse<WrongNote[]>>('/api/wrong-notes');
  return res.data;
}

export async function addWrongNoteAPI(answerId: number) {
  const res = await client.post<ApiResponse<null>>(`/api/wrong-notes/${answerId}`);
  return res.data;
}

export async function deleteWrongNoteAPI(id: number) {
  const res = await client.delete<ApiResponse<null>>(`/api/wrong-notes/${id}`);
  return res.data;
}
