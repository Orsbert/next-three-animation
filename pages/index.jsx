import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'

const AvgModel = dynamic(() => import('./components/Model'), {
  ssr: false
})

export default function App() {
  const canvas = useRef()
  return (
    <>
      <Canvas
        ref={canvas}
        camera={{
          fov: 600,
        }}
        style={{
          position: 'fixed',
          top: '0px',
          right:'0px',
          width: '100%',
          height: '100vh',
          backgroundColor: 'yellow',
        }}
      >
        <AvgModel/>
      </Canvas>
    </>
  )
}