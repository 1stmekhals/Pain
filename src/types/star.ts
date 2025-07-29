export interface Star {
  id: string;
  message: string;
  x: number;
  y: number;
  size: number;
  brightness: number;
  profile_id: string;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
    hide_display_name: boolean;
  };
}