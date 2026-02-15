import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface LatentSpaceSceneProps {
  positions: { x: number; y: number; z: number }[]
}

function Orb({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.08
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={ref} position={position} scale={0.35}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#00f5d4"
          emissive="#00f5d4"
          emissiveIntensity={0.25}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          metalness={0.1}
          roughness={0.3}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  )
}

export function LatentSpaceScene({ positions }: LatentSpaceSceneProps) {
  return (
    <>
      {positions.map((p, i) => (
        <Orb key={i} position={[p.x, p.y, p.z]} index={i} />
      ))}
    </>
  )
}
