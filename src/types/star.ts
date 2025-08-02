// TypeScript type definition for Star objects
// Defines the structure and properties of stars in the application
export interface Star {
  id: string; // Unique identifier for the star
  star_name: string; // Unique name given to the star by the user
  message: string; // Message content associated with the star
  x: number; // Horizontal position of the star (percentage from left)
  y: number; // Vertical position of the star (percentage from top)
  size: number; // Size of the star (affects visual appearance)
  brightness: number; // Brightness level of the star (affects opacity and glow)
  sky_type: 'general' | 'user'; // Type of sky the star belongs to
  profile_id: string; // ID of the user who created the star
  created_at: string; // Timestamp when the star was created
  profiles?: { // Optional profile information of the star creator
    username: string; // Username of the creator
    display_name: string; // Display name of the creator
    hide_display_name: boolean; // Whether the creator wants to hide their display name
  };
}