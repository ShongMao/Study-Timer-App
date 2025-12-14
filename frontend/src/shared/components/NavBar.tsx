import { NavLink } from "react-router-dom";

export default function NavBar() {
  // Used to highlight the title of the page that the user is currently on in the navbar.
  const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors ${
    isActive
      ? 'bg-amber-800 text-white'
      : 'text-gray-600 hover:bg-gray-100'
  } px-4 py-2 rounded-xl`;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm z-50">
      <nav className="max-w-7xl mx-auto h-full flex items-center gap-6 px-6">
        <NavLink to="/timer" className={linkClass}>Timer</NavLink>
        <NavLink to="/subjects" className={linkClass}>Subjects</NavLink>
        <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
        <NavLink to="/statistics" className={linkClass}>Statistics</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </nav>

    </header>
  )
}