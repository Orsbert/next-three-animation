import React, { useEffect, useRef, useState } from 'react'
import { Center, Html, PresentationControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useFrame } from '@react-three/fiber'
import Lights from './Lights'
// @ts-ignore
import { motion } from 'framer-motion/three'
import { useViewportScroll } from 'framer-motion'
import { AnimationMixer } from 'three'

const dev = process.env.NODE_ENV !== 'production'

export const server = dev ? 'http://localhost:3000' : 'https://logx-site.netlify.app/'

export default function Model(props) {
  const group = useRef()
  let actions = useRef({})

  const [model, setModel] = useState(null)
  const [animation, setAnimation] = useState(null)

  /* Mixer */
  const [mixer] = useState(() => new AnimationMixer(null))

  const { scrollYProgress } = useViewportScroll()
  
  useEffect(() => {
    // Instantiate a loader
    const loader = new GLTFLoader()

    loader.load(`${server}/objects/cube_move.gltf`, async (gltf) => {
      const nodes = await gltf.parser.getDependencies("node")
      const animations = await gltf.parser.getDependencies("animation")
      setModel(nodes[0])
      setAnimation(animations)
    })
  },[])

  /* Set animation */
  useEffect(() => {
    if (animation && typeof group.current != "undefined") {
      actions = {
        ...actions,
        current: {
          idle: mixer.clipAction(animation[0], group.current),
        }
      }
      // @ts-ignore
      actions.current.idle.play();
      return () => animation.forEach((clip) => mixer.uncacheClip(clip));
    }
  }, [animation])

  /* Animation update */
  useFrame((_, delta) => mixer.update(delta))

  return (
    <>
      {model ? (
        <group ref={group}>
          <Lights/>
          <PresentationControls>
            <Center>
              <motion.group
                ref={group}
                rotation={[Math.PI / 2, 0, scrollYProgress]}
                dispose={null}
              >
                <motion.primitive
                  ref={group}
                  object={model}
                  // rotation={[-11, 9, 0.3]}
                  rotation={[
                    -11,
                    9,
                    0.3,
                  ]}
                  scale={0.7}
                />
              </motion.group>
            </Center>
          </PresentationControls>
          </group>
      ) : (
          <Html>Loading.. </Html>
      )
      }
    </>
  )
}
