import useAuth from "../stores/authStore"

export default function Logout({ setLoggedIn }: { setLoggedIn: (loggedIn: boolean) => void }) {
  const { setUser } = useAuth()
  const handleLogout = async () => {
    localStorage.removeItem("jwt")
    setLoggedIn(false)
    setUser(null)
    window.location.href = "/"
  }

  return (
      <span onClick={handleLogout}>Logout</span>
  )
}
