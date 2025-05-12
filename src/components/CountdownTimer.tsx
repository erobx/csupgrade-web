import { useState, useEffect } from "react";

export default function CountdownTimer({ stopTime }: { stopTime: string }) {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  
  function calculateTimeRemaining() {
    // Create date objects
    let stopDate;
    
    try {
      // Handle different date formats
      stopDate = new Date(stopTime);
      
      // Check if the date is valid
      if (isNaN(stopDate.getTime())) {
        console.error("Invalid date format:", stopTime);
        return {
          minutes: 0,
          seconds: 0,
          expired: true
        };
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      return {
        minutes: 0,
        seconds: 0,
        expired: true
      };
    }
    
    const now = new Date();
    
    // Calculate the difference in milliseconds
    const difference = stopDate.getTime() - now.getTime();
    
    // If time has passed, return all zeros
    if (difference <= 0) {
      return {
        minutes: 0,
        seconds: 0,
        expired: true
      };
    }
    
    // Calculate time components
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    
    return {
      minutes,
      seconds,
      expired: false
    };
  }
  
  useEffect(() => {
    // Calculate initial time remaining
    setTimeRemaining(calculateTimeRemaining());
    
    // Set up interval
    const timer = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining();
      setTimeRemaining(newTimeRemaining);
      
      // Clear interval if timer has expired
      if (newTimeRemaining.expired) {
        clearInterval(timer);
      }
    }, 1000);
    
    // Cleanup interval on component unmount or when stopTime changes
    return () => clearInterval(timer);
  }, [stopTime]); // Dependency on stopTime to recalculate when it changes
  
  // Pad single digit numbers with a leading zero
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  // If expired, show expiration message
  if (timeRemaining.expired) {
    return (
      <div className="text-red-500 font-bold">
        Time has expired!
      </div>
    );
  }
  
  return (
    <div className="flex space-x-4 bg-base-100 p-4 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold text-warning">{pad(timeRemaining.minutes)}</div>
        <div className="text-xs">Minutes</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-warning">{pad(timeRemaining.seconds)}</div>
        <div className="text-xs">Seconds</div>
      </div>
    </div>
  );
}
