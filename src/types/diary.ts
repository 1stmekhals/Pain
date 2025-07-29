export interface DiaryEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateDiaryEntry = Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'>;
export type UpdateDiaryEntry = Partial<CreateDiaryEntry> & { id: string };