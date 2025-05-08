import { Link } from "react-router"
import Footer from "../components/Footer"
import React, { useEffect, useRef, useState } from "react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col flex-grow items-center w-full"> 
        <PageTop />
        <PageMiddle />
        <Footer />
      </div>
    </div>
  )
}

function PageTop() {
  return (
    <div className="hero bg-base-100 h-96">
      <div className="hero-content text-center justify-between">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold">
            Trade Together, Win Big!
          </h1>
          <h2 className="text-xl py-4">
            Join forces with others to upgrade your skins. More players, more chances, better outcomes. Ready to trade up?
          </h2>
          <Link to="/login" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>
  )
}

function PageMiddle() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    }
  }

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.strokeStyle = "black"
      ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      ctx.closePath()
    }
  }

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (canvas && container) {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  return (
    <div ref={containerRef} className="hero bg-base-200 flex-grow relative" style={{ backgroundImage: "url(contract.png)", backgroundSize: "contain"}}>
      <canvas
        ref={canvasRef}
        className="absolute"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>
    </div>
  )
}
