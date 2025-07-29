export interface Profile {
  id: string;
  username: string;
  display_name: string;
  first_name: string;
  last_name: string;
  hide_display_name: boolean;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUserView {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  display_name: string | null;
  created_at: string;
  is_profile_complete: boolean;
}