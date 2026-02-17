import { NavLink } from "react-router-dom";
import {
  Timer,
  Folder,
  Trophy,
  BarChart3,
  User,
  Contact
} from "lucide-react";

export default function NavBar() {
  // Used to highlight the title of the page that the user is currently on in the navbar.
  // Change bg-[#245543] to more suitable background color later.
  const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 transition-colors px-4 py-2 rounded-xl ${
    isActive
      ? 'bg-[#3b0764] text-white'
      : 'text-gray-600 hover:bg-gray-100'
  }`;

  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 flex items-center overflow-x-auto scrollbar-hide">
      {/* Container for the logo (TODO) */}
      <nav className="ml-4 flex items-center gap-2">
        <NavLink to="/timer" className="flex items-center gap-2 transition-colors px-4 py-2 rounded-xl text-xl">Lakin</NavLink>
      </nav>

      {/* Spacer to push nav links to the right */}
      <div className="flex-1 min-w-6" />

      {/* Allows for scrolling of the navbar when the screen is collapsed */}
      <nav className="h-full flex items-center">
        {/* Change pr-* for the spacing of the navigation links */}
        <div className="ml-auto flex items-center gap-6 pr-6">
          {/* <NavLink to="/test" className={linkClass}><Timer size={18} />Test</NavLink> */}
          <NavLink to="/timer" className={linkClass}><Timer size={18} />Timer</NavLink>
          <NavLink to="/subjects" className={linkClass}><Folder size={18} />Subjects</NavLink>
          <NavLink to="/leaderboard" className={linkClass}><Trophy size={18} />Leaderboard</NavLink>
          <NavLink to="/friends" className={linkClass}><Contact size={18} />Friends</NavLink>
          <NavLink to="/statistics" className={linkClass}><BarChart3 size={18} />Statistics</NavLink>
          <NavLink to="/profile" className={linkClass}><User size={18} />Profile</NavLink>
        </div>
      </nav>

    </header>
  )
}