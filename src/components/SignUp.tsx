import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../stores/authStore"
import { BASE_URL } from "../constants/constants";
import { useInventory } from "../providers/InventoryProvider";

// {"username":"","email":"","password":""}
export const submitSignup = async (username: string, email: string, password: string) => {
    const user = {
        email: email,
        username: username,
        password: password,
    }

    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    }

    try {
        const res = await fetch(BASE_URL+"/auth/register", opts)
        const data = await res.json()
        return data
    } catch (error) {
        console.error('Error:', error)
    }
}

export default function SignUp() {
  const navigate = useNavigate()
  const { setUser, setLoggedIn } = useAuth()
  const { setInventory } = useInventory()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const data = await submitSignup(username, email, password) 
      if (data) {
        setLoggedIn(true)
        setUser(data.user)
        setInventory(data.inventory)

        localStorage.setItem("jwt", data.jwt)
        resetForm()
        window.location.reload()
      } else {
        console.error("Sign up failed.")
      }
    } catch (error) {
        console.error("Error during sign up:", error)
    } finally {
        setLoading(false)
    }
  }

  const validateForm = () => {
      if (username.length < 3 || username.length > 30) return false
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return false
      if (!password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)) return false
      if (password !== confirmPassword) return false
      return true
  }

  const resetForm = () => {
      setUsername("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
  }

  return (
    <div className="flex items-center justify-center">
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend">Sign Up</legend>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <label className="fieldset-label">Username</label>
          <input
            type="username"
            className="input validator"
            required
            placeholder="Username"
            minLength={3}
            maxLength={30}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="validator-hint hidden">Must be 3 to 30 characters containing only letters, numbers or dash</p>
          
          <label className="fieldset-label">Email</label>
          <input
            type="email"
            className="input validator"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="validator-hint hidden">Enter valid email address</div>
          
          <label className="fieldset-label">Password</label>
          <input
            type="password"
            className="input validator"
            required
            placeholder="Password"
            minLength={8}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <p className="validator-hint hidden">
            Must be more than 8 characters, including
            <br/>At least one number
            <br/>At least one lowercase letter
            <br/>At least one uppercase letter
          </p>

          <label className="fieldset-label">Confirm Password</label>
          <input
            type="password"
            className="input validator"
            required
            placeholder="Confirm Password"
            pattern={password}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <p className="validator-hint hidden">
            Passwords must match
          </p>

          <button
            type="submit"
            className={`btn btn-neutral mt-4 ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </fieldset>
    </div>
  )
}
