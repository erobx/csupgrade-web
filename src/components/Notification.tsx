import { useEffect } from "react"
import { useNotification } from "../stores/notificationStore"

export default function Notification() {
  const { notifications, removeNotification } = useNotification()

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].message)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [notifications])

  return (
    <div className="toast toast-end z-10">
      {notifications.map((notification, index) => {
        if (notification.type === "success") {
          return (
            <div key={index} className="alert alert-success">
              <span>{notification.message}</span>
            </div>
          )
        } else if (notification.type === "error") {
          return (
            <div key={index} className="alert alert-error">
              <span>{notification.message}</span>
            </div>
          )
        } else if (notification.type === "info") {
          return (
            <div key={index} className="alert alert-info">
              <span>{notification.message}</span>
            </div>
          )
        } else if (notification.type === "warning") {
          return (
            <div key={index} className="alert alert-warning">
              <span>{notification.message}</span>
            </div>
          )
        } else {
          return (
            <div key={index} className="alert">
              <span>{notification.message}</span>
            </div>
          )
        }
      })}
    </div>
  )
}
