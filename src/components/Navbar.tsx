import { Link } from "react-router";
import useAuth from "../stores/authStore";
import Dropdown from "./Dropdown";
import Balance from "./Balance";

export default function Navbar() {
  const { user, loggedIn } = useAuth()

  return (
    <div className="navbar border-b bg-base-200 shadow-sm">
      <div className="navbar-start">
        {/* Smaller screens */}
        <div className="flex m-0 md:hidden">
          {loggedIn ? (
            <Link to="/dashboard" className="btn btn-ghost text-md">Dashboard</Link>
          ): (
            <Link to="/" className="btn btn-ghost text-lg">Home</Link>
          )}
          <Link to="/tradeups" className="btn btn-ghost text-md">Tradeups</Link>
        </div>
        {/* Larger screens */}
        <div className="hidden md:flex">
          {loggedIn ? (
            <Link to="/dashboard" className="btn btn-ghost text-lg">Dashboard</Link>
          ): (
            <Link to="/" className="btn btn-ghost text-lg">Home</Link>
          )}
          <Link to="/tradeups" className="btn btn-ghost text-lg">Tradeups</Link>
          <Link to="/store" className="btn btn-ghost text-lg">Store</Link>
        </div>
      </div>

      <div className="navbar-end mr-1">
        {/* Smaller screens */}
        <div className="md:hidden">
          {loggedIn && user ? (
            <>
              <Balance balance={user.balance} />
              <Dropdown />
            </>
          ) : (
            <Link to="/login" className="btn btn-ghost text-xl">Login</Link>
          )}
        </div>
        {/* Larger screens */}
        <div className="hidden md:flex items-center">
          {loggedIn && user ? (
            <>
              <Balance balance={user.balance} />
              <Dropdown />
            </>
          ) : (
            <Link to="/login" className="btn btn-ghost text-xl">Login</Link>
          )}
        </div>
      </div>
    </div>
  )
}
