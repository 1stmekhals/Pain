# 🌟 Star Letter

A beautiful, interactive web application where users can create and share messages as stars in a virtual night sky. Experience the magic of leaving your thoughts among the stars for others to discover.

![Star Letter](https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=400&fit=crop)

## ✨ Features

### 🌌 **Interactive Star Sky**
- **Dynamic Day/Night Cycle** - Experience realistic day and night skies based on your location
- **Realistic Stars** - Beautiful, twinkling stars with authentic visual effects
- **Detailed Moon** - Realistic lunar surface with craters, maria, and atmospheric glow
- **Atmospheric Effects** - Nebulae, Milky Way band, and cosmic backgrounds

### 💫 **Star Creation & Messaging**
- **Create Personal Stars** - Turn your messages into beautiful stars in the sky
- **Unique Star Names** - Each star has a unique name (no duplicates allowed)
- **Interactive Messages** - Click on any star to read its message
- **Star Management** - Edit or delete your own stars

### 🌍 **Dual Sky System**
- **General Sky** - Shared space where everyone can see all public stars
- **Personal Sky** - Your private space for personal stars and messages
- **User Sky Viewing** - Visit other users' personal skies to see their stars

### 🔍 **Advanced Search**
- **Unified Search** - Search for both users and stars in one interface
- **User Discovery** - Find other users and visit their personal skies
- **Star Discovery** - Search through star messages and names
- **Real-time Results** - Instant search results as you type

### 🎵 **Background Music**
- **Ambient Soundscapes** - Relaxing background music for immersive experience
- **Admin Music Management** - Admins can upload and manage background tracks
- **Playlist System** - Multiple tracks with random playback
- **Volume Controls** - Mute, play/pause, and skip controls

### 👤 **User Management**
- **Secure Authentication** - Email/password authentication with Supabase
- **User Profiles** - Complete profiles with usernames and display names
- **Privacy Controls** - Hide display names for privacy
- **Password Reset** - Secure password reset via email

### 🛡️ **Admin Panel**
- **User Management** - View and manage all registered users
- **Star Moderation** - Monitor and manage all stars in the system
- **Music Management** - Upload and manage background music tracks
- **Search & Filter** - Advanced search capabilities for administration

### 📱 **Responsive Design**
- **Mobile Optimized** - Works beautifully on all device sizes
- **Touch Friendly** - Optimized touch interactions for mobile devices
- **Adaptive UI** - Interface adapts to screen size and orientation
- **Cross-browser Compatible** - Works on all modern browsers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd star-letter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   - Apply all SQL migrations in the `supabase/migrations/` folder to your Supabase project

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## 🗄️ Database Schema

### Core Tables
- **`users`** - User authentication data (managed by Supabase Auth)
- **`profiles`** - Extended user profile information
- **`stars`** - User-created stars with messages and positions
- **`admin_users`** - Admin user designations
- **`background_music`** - Background music tracks

### Key Features
- **Row Level Security (RLS)** - Secure data access controls
- **Real-time Subscriptions** - Live updates for collaborative features
- **Foreign Key Constraints** - Data integrity and cascading deletes
- **Indexed Queries** - Optimized performance for searches

## 🎨 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful, consistent icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data updates

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing and optimization

## 🌟 Usage Guide

### Creating Your First Star
1. **Sign up** for an account or **sign in**
2. Click the **hamburger menu** (☰) in the top right
3. Select **"Create Star"**
4. Enter a **unique star name** and your **message**
5. Click **"Create Star"** - your star will appear in the sky!

### Exploring the Sky
- **Click on any star** to read its message
- Use the **Sky Selector** to switch between General Sky and Personal Sky
- **Search for users** to visit their personal skies
- **Search for stars** to find specific messages

### Managing Your Profile
1. Click the **hamburger menu** (☰)
2. Select **"Profile"**
3. Complete your profile information
4. Choose privacy settings for your display name

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL migrations from `supabase/migrations/`
3. Configure CORS settings to allow your domain
4. Set up authentication providers (email/password enabled by default)

### Admin Setup
1. Add admin users to the `admin_users` table
2. Admins can access the admin panel via the hamburger menu
3. Upload background music through the admin interface

### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🎯 Features in Detail

### Star System
- **Unique Naming** - Each star must have a unique name across the entire system
- **Position Generation** - Stars are automatically positioned to avoid UI elements
- **Visual Variety** - Each star has randomized size and brightness
- **Interactive Feedback** - Hover effects and click animations

### Sky Types
- **General Sky** - Public space visible to all users
- **User Sky** - Personal space for individual users
- **Sky Navigation** - Easy switching between different sky views

### Search System
- **Multi-type Search** - Search users and stars simultaneously
- **Real-time Results** - Instant feedback as you type
- **Navigation Integration** - Click results to navigate to user skies or view stars

### Music System
- **Streaming Support** - Supports various audio formats
- **Random Playback** - Automatically plays random tracks from playlist
- **Admin Controls** - Upload, manage, and delete tracks
- **User Controls** - Play, pause, skip, and volume controls

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (Supabase client)
├── store/              # State management (Zustand)
├── types/              # TypeScript type definitions
└── assets/             # Static assets

supabase/
└── migrations/         # Database migration files
```

### Key Components
- **`StarrySky`** - Main sky rendering and star display
- **`AuthModal`** - Authentication interface
- **`AdminPanel`** - Administrative interface
- **`UnifiedSearch`** - Search functionality
- **`MusicPlayer`** - Background music controls

### State Management
- **`useAuthStore`** - Authentication state and user management
- **Local State** - Component-specific state with React hooks
- **Supabase Realtime** - Live data synchronization

## 🔒 Security

### Authentication
- **Supabase Auth** - Secure user authentication
- **JWT Tokens** - Stateless authentication tokens
- **Password Requirements** - Strong password enforcement
- **Email Verification** - Optional email confirmation

### Authorization
- **Row Level Security** - Database-level access control
- **Admin Permissions** - Role-based admin access
- **User Ownership** - Users can only modify their own data
- **Public/Private Data** - Controlled visibility of user data

### Data Protection
- **Input Validation** - Client and server-side validation
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Sanitized user inputs
- **CORS Configuration** - Controlled cross-origin requests

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Supabase Configuration
1. Update CORS settings for your production domain
2. Configure authentication redirects
3. Set up custom domain (optional)
4. Configure email templates

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For the amazing backend-as-a-service platform
- **React Team** - For the incredible React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For beautiful animations
- **Lucide** - For the beautiful icon set
- **Unsplash** - For the stunning background images

## 📞 Support

If you encounter any issues or have questions:

1. **Check the Issues** - Look for existing solutions
2. **Create an Issue** - Report bugs or request features
3. **Documentation** - Review this README and code comments
4. **Community** - Join discussions in the repository

---

**Made with ❤️ and ⭐ by the Starry Messages team**

*Leave your mark among the stars* ✨