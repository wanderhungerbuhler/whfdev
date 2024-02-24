'use client'
import React, { startTransition, useEffect, useState } from 'react'
import Image from 'next/image'

import FlagENSVG from '@/assets/flag-en.svg'
import FlagFRSVG from '@/assets/flag-fr.svg'
import FlagBRSVG from '@/assets/flag-br.svg'
import ImageWhiteSvg from '@/assets/logo-white.svg'
import ImageBlackSvg from '@/assets/logo-black.svg'
import SicNoticiasSvg from '@/assets/sicnoticias.svg'
import ZionStorySvg from '@/assets/zionstory.svg'
import ExpressoSvg from '@/assets/expresso.svg'
import IconAppStoreSvg from '@/assets/icon-appstore.svg'
import IconPlayStore from '@/assets/icon-playstore.svg'
import SicnoticiasIMG from '@/assets/brands/sicnoticias.svg'
import ExpressoIMG from '@/assets/brands/expresso.svg'
import ZionStoryIMG from '@/assets/brands/zionstory.svg'
import BCNOutdoorIMG from '@/assets/brands/bcnoutdoor.svg'
import GeventIMG from '@/assets/brands/gevent.svg'
import JPIMG from '@/assets/brands/jp.svg'
import RJIMG from '@/assets/brands/rj.svg'
import SeturIMG from '@/assets/brands/secturismo.svg'
import GuiaTurismoIMG from '@/assets/brands/guiaturismo.svg'
import CGEIMG from '@/assets/brands/cge.svg'
import AGJoiasIMG from '@/assets/brands/agjoias.svg'
import Link from 'next/link'
import { Moon, Sun } from 'phosphor-react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('Index')
  const router = useRouter()
  const { locale } = useParams()

  const [flag, setFlag] = useState(locale)
  const [theme, setTheme] = useState<string | null>('light')

  const [switchMode, setSwitchMode] = useState(false)

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

  useEffect(() => {
    function getTheme() {
      if (typeof window !== 'undefined') {
        const system = localStorage.getItem('mobato-theme')
        setTheme(system)
        return system
      }
    }

    getTheme()
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.querySelector('html')?.classList.add('dark')
      if (typeof window !== 'undefined') {
        localStorage.setItem('mobato-theme', 'dark')
      }
    } else {
      document.querySelector('html')?.classList.remove('dark')
      if (typeof window !== 'undefined') {
        localStorage.setItem('mobato-theme', 'light')
      }
    }
  }, [theme])

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
    setSwitchMode(!switchMode)
  }

  return (
    <div className="w-full bg-white transition-colors dark:bg-primary">
      <div className="m-auto w-full max-w-[1080px]">
        <div className="grid grid-cols-1 items-center justify-between gap-5 px-10 py-5 md:flex md:gap-0">
          <div className="m-auto flex flex-col items-center justify-center gap-2 md:m-0">
            <Image
              src={theme === 'light' ? ImageBlackSvg : ImageWhiteSvg}
              className="m-auto md:order-none md:m-0"
              width={100}
              height={50}
              quality={100}
              alt="WHFdev Logo"
            />
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
          </div>

          <div className="flex items-center justify-center gap-5">
            {theme === 'dark' ? (
              <Moon
                weight="fill"
                className="cursor-pointer text-primary dark:text-white"
                onClick={handleChangeTheme}
              />
            ) : (
              theme === 'light' && (
                <Sun
                  weight="fill"
                  className=" cursor-pointer text-orange-300 dark:text-white"
                  onClick={handleChangeTheme}
                />
              )
            )}

            <Link
              href="mailto:falecom@whfdev.com.br"
              target="_blank"
              className="rounded-full border px-5 font-semibold text-gray-300 transition-colors hover:border-transparent hover:bg-green-500 hover:text-white dark:border-none dark:bg-green-500 dark:text-white"
            >
              {t('Contact')}
            </Link>
          </div>
        </div>

        <main className="flex flex-col items-center justify-center leading-none">
          <div className="flex max-w-[860px] flex-col items-center justify-center py-20 md:h-[90vh]">
            <span className="text-xl font-normal uppercase text-gray-400 transition-colors dark:text-gray-300 md:text-3xl">
              {t('DO YOU NEED')}
            </span>
            <h1 className="text-[70px] font-black uppercase text-gray-400 transition-colors dark:text-gray-200 md:text-[100px]">
              {t('INNOVATE')}
            </h1>
            <p className="w-[70%] text-center text-sm leading-7 text-gray-400 transition-colors dark:text-gray-200 md:text-base">
              {t('Slogan1')}
            </p>
          </div>

          <div className="flex max-w-[860px] flex-col items-center justify-center">
            <span className="text-xl font-normal uppercase text-gray-400 transition-colors dark:text-gray-300">
              {t('DO YOU NEED')}
            </span>
            <h1 className="text-[50px] font-black uppercase text-gray-400 transition-colors dark:text-gray-200">
              {t('TO KNOW')}
            </h1>

            <div className="mt-5 flex gap-10 px-5">
              <div className="flex flex-col items-center justify-center gap-2">
                <Link
                  href="https://apps.apple.com/pt/app/sic-not%C3%ADcias/id1478878799?l=en-GB"
                  target="_blank"
                >
                  <Image
                    src={IconAppStoreSvg}
                    quality={100}
                    alt="SIC Noticias App Store Download"
                  />
                </Link>
                <Image
                  src={SicNoticiasSvg}
                  quality={100}
                  width={220}
                  alt="App SIC Noticias"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.zionstory"
                    target="_blank"
                  >
                    <Image
                      src={IconPlayStore}
                      quality={100}
                      alt="Zion Story Play Store Download"
                    />
                  </Link>

                  <Link
                    href="https://apps.apple.com/pt/app/zion-story/id6476232761?l=en-GB"
                    target="_blank"
                  >
                    <Image
                      src={IconAppStoreSvg}
                      quality={100}
                      alt="Zion Story App Store Download"
                    />
                  </Link>
                </div>
                <Image
                  src={ZionStorySvg}
                  quality={100}
                  width={270}
                  alt="App SIC Noticias"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <Link
                  href="https://apps.apple.com/pt/app/expresso/id416836970?l=en-GB"
                  target="_blank"
                >
                  <Image
                    src={IconAppStoreSvg}
                    quality={100}
                    alt="Expresso App Store Download"
                  />
                </Link>
                <Image
                  src={ExpressoSvg}
                  quality={100}
                  width={220}
                  alt="App SIC Noticias"
                />
              </div>
            </div>
          </div>

          <div className="mb-32 mt-32 flex max-w-[860px] flex-col items-center justify-center">
            <span className="text-xl font-normal uppercase text-gray-400 transition-colors dark:text-gray-300">
              {t('DO YOU NEED')}
            </span>
            <h1 className="mb-10 text-[50px] font-black uppercase text-gray-400 transition-colors dark:text-gray-200">
              {t('BE A PART')}
            </h1>
            <ul className="m-auto mt-5 grid grid-cols-5 items-center justify-center gap-5 max-sm:grid max-sm:w-[70%] max-sm:grid-cols-3 max-sm:gap-10">
              <Link href="https://sicnoticias.pt" target="_blank">
                <Image
                  src={SicnoticiasIMG}
                  alt="Sic Notícias"
                  className="m-auto"
                />
              </Link>

              <Link href="https://expresso.pt" target="_blank">
                <Image
                  src={ExpressoIMG}
                  width={100}
                  quality={100}
                  alt="Sic Notícias"
                  className="m-auto"
                />
              </Link>

              <Link href="https://sicnoticias.pt" target="_blank">
                <Image
                  src={ZionStoryIMG}
                  width={100}
                  quality={100}
                  alt="Sic Notícias"
                  className="m-auto"
                />
              </Link>

              <Link href="https://bcnoutdoortraining.com" target="_blank">
                <Image
                  src={BCNOutdoorIMG}
                  alt="Sic Notícias"
                  className="m-auto"
                />
              </Link>

              <Link href="https://gevent.vercel.app/" target="_blank">
                <Image src={GeventIMG} alt="geVent" className="m-auto" />
              </Link>

              <Link
                href="https://jovensprotagonistas.vercel.app/"
                target="_blank"
              >
                <Image
                  src={JPIMG}
                  alt="Jovens Protagonistas"
                  className="m-auto"
                />
              </Link>

              <Link href="http://rj.gov.br" target="_blank">
                <Image src={RJIMG} alt="RJ.gov" className="m-auto" />
              </Link>

              <Link href="https://seturweb.netlify.app/" target="_blank">
                <Image
                  src={SeturIMG}
                  alt="Secretiria de Tusimo do Estado do Rio de Janeiro"
                  className="m-auto"
                />
              </Link>

              <Link href="#">
                <Image
                  src={GuiaTurismoIMG}
                  alt="Guia de Turismo RJ"
                  className="m-auto"
                />
              </Link>

              <Link href="http://www.cge.rj.gov.br/" target="_blank">
                <Image
                  src={CGEIMG}
                  alt="Controladoria Geral do Estado do Rio de Janeiro"
                  className="m-auto"
                />
              </Link>

              <Link href="https://andersongomesjoias.com.br/" target="_blank">
                <Image
                  src={AGJoiasIMG}
                  alt="Anderson Gomes Jóias"
                  className="m-auto"
                />
              </Link>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}
