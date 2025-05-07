import { useNavigate } from "react-router"
import useAuth from "../stores/authStore"
import { useState } from "react"
import { useInventory } from "../providers/InventoryProvider"
import { Inventory } from "../types/inventory"
import { User } from "../types/user"
import { BASE_URL } from "../constants/constants"

type Response = {
  user: User;
  inventory: Inventory;
  jwt: string;
}

export const submitLogin = async (email: string, password: string): Promise<Response | void> => {
  const creds = {
      email: email,
      password: password,
  }

  const opts = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds)
  }

  try {
      const res = await fetch(BASE_URL + "/auth/login", opts)
      const data: Promise<Response> = await res.json()
      return data
  } catch (error) {
    console.error('Error:', error)
  }
}

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setLoggedIn } = useAuth()
  const { setInventory } = useInventory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    if (loading) return
    e.preventDefault()
    setLoading(true)

    try {
      const data = await submitLogin(email, password)
      if (data) {
        setLoggedIn(true)
        setUser(data.user)
        setInventory(data.inventory)

        localStorage.setItem("jwt", data.jwt)
        navigate("/dashboard")
        resetForm()
      } else {
        console.error("Login failed. Please check your credentials.")
      }
    } catch (error) {
        console.error("Error during login:", error)
    } finally {
        setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
  }

  return (
    <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
      <legend className="fieldset-legend">Login</legend>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <label className="fieldset-label">Email</label>
          <input
            type="email"
            className="input validator" 
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="validator-hint hidden">Enter valid email address</div>
      
          <label className="fieldset-label">Password</label>
          <input
            type="password"
            className="input"
            required
            placeholder="Password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
      
          <button
            type="submit"
            className={`btn btn-neutral mt-4 ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
      </form>
    </fieldset>
  )
}
