import { Routes, Route } from 'react-router'
import { WebSocketProvider } from './providers/WebSocketProvider'
import { InventoryProvider } from './providers/InventoryProvider'
//import { WebSocketSubscriber } from './providers/WebSocketSubscriber'
import Home from './pages/Home'
import SignUpLogin from './pages/SignUpLogin'
import TradeupsHome from './pages/TradeupsHome'
import TradeupDetails from './pages/TradeupDetails'
import DashboardPage from './pages/DashboardPage'
import StorePage from './pages/StorePage'
import Navbar from './components/Navbar'
import Notification from './components/Notification'
import useAuth from './stores/authStore'
import { useEffect, useState } from 'react'
import { BASE_URL } from './constants/constants'

export default function App() {
  const { loggedIn, setUser, setLoggedIn } = useAuth()
  const [userID, setUserID] = useState("")
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const jwt = localStorage.getItem("jwt")
      if (jwt) {
        try {
          const res = await fetch(BASE_URL+`/v1/users`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          })

          if (res.status === 401) {
            const newToken = res.headers.get("X-New-Token")
            if (newToken) {
              localStorage.setItem("jwt", newToken)

              const retryRes = await fetch(BASE_URL+`/v1/users`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${newToken}`
                }
              })

              if (retryRes.ok) {
                const data = await retryRes.json()
                setUser(data.user)
                setUserID(data.user.id)
                setLoggedIn(true)
              } else {
                throw new Error("Failed to fetch user after token refresh")
              }
            } else {
              throw new Error("Token expired and refresh failed")
            }
          } else if (res.ok) {
            const data = await res.json()
            setUser(data.user)
            setUserID(data.user.id)
            setLoggedIn(true)
          } else {
            throw new Error("Error fetching user data")
          }
        } catch (error) {
          console.error("Error loading user:", error)
          setLoggedIn(false)
          setUser(null)
        }
      }
        setAuthReady(true)
    }

    fetchUser()
  },[])

  return (
    <InventoryProvider userId={userID}>
      {/* Conditionally render WebSocketProvider only when we have a real userId */}
      {authReady && userID ? (
        <WebSocketProvider userId={userID}>
          <AppContent loggedIn={loggedIn} />
        </WebSocketProvider>
      ) : (
        <AppContent loggedIn={loggedIn} />
      )}
    </InventoryProvider>  )
}

function AppContent({ loggedIn }: {loggedIn: boolean}) {
  return (
    <>
      <Navbar />
      <Notification />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login/*" element={loggedIn ? <DashboardPage /> : <SignUpLogin />} />
        <Route path="store" element={<StorePage />} />
        <Route path="tradeups">
          <Route index element={<TradeupsHome />} />
          <Route path=":tradeupId" element={<TradeupDetails />} />
        </Route>
        <Route path="/dashboard/*" element={loggedIn ? <DashboardPage /> : <SignUpLogin />} />
      </Routes>
    </>
  )
}
