'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type Direction = 'up' | 'left' | 'right' | 'fade'

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  left: { x: -24 },
  right: { x: 24 },
  fade: {},
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: Direction
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
}) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    const Tag = as as 'div'
    return <Tag className={className}>{children}</Tag>
  }

  const variants: Variants = {
    hidden: { opacity: 0, ...offset[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  }

  const MotionTag = motion[as] as typeof motion.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px 0px' }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.7, 0.2, 1],
      }}
      variants={variants}
    >
      {children}
    </MotionTag>
  )
}
