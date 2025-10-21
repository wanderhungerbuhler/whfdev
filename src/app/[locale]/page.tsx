'use client'
import { IconChartTreemap, IconHome, IconMessage } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'

import AGJoiasIMG from '@/assets/brands/agjoias.svg'
import BCNOutdoorIMG from '@/assets/brands/bcnoutdoor.svg'
import CGEIMG from '@/assets/brands/cge.svg'
import ExpressoIMG from '@/assets/brands/expresso.svg'
import GeventIMG from '@/assets/brands/gevent.svg'
import CoachGuth from '@/assets/brands/gh.svg'
import GuiaTurismoIMG from '@/assets/brands/guiaturismo.svg'
import JPIMG from '@/assets/brands/jp.svg'
import RJIMG from '@/assets/brands/rj.svg'
import SeturIMG from '@/assets/brands/secturismo.svg'
import SicnoticiasIMG from '@/assets/brands/sicnoticias.svg'
import ZionStoryIMG from '@/assets/brands/zionstory.svg'
import ExpressoSvg from '@/assets/expresso.svg'
import IconAppStoreSvg from '@/assets/icon-appstore.svg'
import IconPlayStore from '@/assets/icon-playstore.svg'
import SicNoticiasSvg from '@/assets/sicnoticias.svg'
import ZionStorySvg from '@/assets/zionstory.svg'
import { Menu } from '@/components/ui/menu'

export default function Home() {
  const t = useTranslations('Index')

  const navItems = [
    {
      name: `${t('Home')}`,
      link: '#home',
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: `${t('Cases')}`,
      link: '#cases',
      icon: (
        <IconChartTreemap className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: `${t('Partners')}`,
      link: '#partners',
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ]

  return (
    <div
      id="home"
      className="w-full bg-foreground transition-colors dark:bg-primary"
    >
      <div className="m-auto w-full max-w-[1080px]">
        <div className="grid grid-cols-1 items-center justify-between gap-5 px-10 py-5 md:flex md:gap-0">
          <Menu navItems={navItems} />
        </div>

        <main
          id="home"
          className="justify-centerleading-none flex flex-col items-center"
        >
          <div className="relative flex h-[50rem] w-full flex-col items-center justify-center bg-black bg-dot-white/[0.2]">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] "></div>
            <span className="text-xl font-normal uppercase text-gray-400 transition-colors dark:text-gray-300 md:text-3xl">
              {t('DO YOU NEED')}
            </span>
            <h1 className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-[4.375rem] font-bold text-transparent md:text-[6.25rem]">
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
            <h1 className="relative z-20 mb-10 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-[50px] font-bold text-transparent">
              {t('TO KNOW')}
            </h1>

            <div id="cases" className="mt-5 flex gap-10 px-5">
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

          <div
            id="partners"
            className="mb-32 mt-32 flex max-w-[860px] flex-col items-center justify-center"
          >
            <span className="text-xl font-normal uppercase text-gray-400 transition-colors dark:text-gray-300">
              {t('DO YOU NEED')}
            </span>
            <h1 className="relative z-20 mb-10 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-[50px] font-bold text-transparent">
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

              <Link
                href="https://apps.apple.com/pt/app/zion-story/id6476232761?l=en-GB"
                target="_blank"
              >
                <Image
                  src={ZionStoryIMG}
                  width={70}
                  quality={100}
                  alt="Zion Story"
                  className="m-auto"
                />
              </Link>

              <Link href="https://coachguth.vercel.app" target="_blank">
                <Image
                  src={CoachGuth}
                  width={70}
                  quality={100}
                  alt="Coach Guth"
                  className="m-auto"
                />
              </Link>

              <Link href="https://bcnoutdoortraining.com" target="_blank">
                <Image
                  src={BCNOutdoorIMG}
                  alt="BCN Outdoor Training"
                  width={70}
                  quality={100}
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
        <footer className="flex items-center justify-center py-5">
          <div className="flex-col text-center">
            <p className="text-gray-700">
              Todos os direitos reservados. WHFDEV Consultoria em Tecnologia
              LTDA
            </p>
            <p className="text-gray-700">CNPJ: 46.185.304/0001-71</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
