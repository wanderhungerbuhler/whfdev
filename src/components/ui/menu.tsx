/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { startTransition, useState } from 'react'

import FlagBRSVG from '@/assets/flag-br.svg'
import FlagENSVG from '@/assets/flag-en.svg'
import FlagFRSVG from '@/assets/flag-fr.svg'
import LogoSvg from '@/assets/logo-white.svg'
import { Button } from '@/components/ui/moving-border'
import { cn } from '@/lib/utils'

export const Menu = ({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
}) => {
  const router = useRouter()
  const { locale } = useParams()
  const [flag, setFlag] = useState(locale)

  function handleChangeLanguage(language: string) {
    const nextLocale = language
    setFlag(language)

    startTransition(() => {
      router.replace(`/${nextLocale}`)
    })

    if (typeof window !== 'undefined') {
      const storedData = localStorage.setItem('@whfdev-idioms', language)
      return storedData
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        transition={{
          duration: 0.2,
        }}
        className={cn(
          'fixed inset-x-0  top-10 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-white/[0.2] bg-black py-2  pl-5 pr-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]',
          className,
        )}
      >
        <Image
          src={LogoSvg}
          width={40}
          height={40}
          quality={100}
          priority
          alt="Logo - Coach Guth"
        />
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              'relative flex items-center space-x-1 text-neutral-400 hover:text-neutral-300 dark:text-neutral-50 dark:hover:text-neutral-300',
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden text-sm sm:block">{navItem.name}</span>
          </Link>
        ))}
        <div className="flex gap-2">
          <button
            onClick={() => handleChangeLanguage('pt')}
            disabled={flag === 'pt'}
            className="opacity-[0.5] disabled:opacity-[1]"
          >
            <Image src={FlagBRSVG} alt="Flag BR" />
          </button>
          <button
            onClick={() => handleChangeLanguage('en')}
            disabled={flag === 'en'}
            className="opacity-[0.5] disabled:opacity-[1]"
          >
            <Image src={FlagENSVG} alt="Flag EN" />
          </button>
          <button
            onClick={() => handleChangeLanguage('fr')}
            disabled={flag === 'fr'}
            className="opacity-[0.5] disabled:opacity-[1]"
          >
            <Image src={FlagFRSVG} alt="Flag FR" />
          </button>
        </div>
        <Link href="wa.me/+351927509754" target="_blank">
          <Button className="relative w-auto rounded-full border border-white/[0.2] bg-foreground px-4 text-sm font-medium text-white">
            Contact
          </Button>
        </Link>
      </motion.div>
    </AnimatePresence>
  )
}
