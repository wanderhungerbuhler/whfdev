import type { StaticImageData } from 'next/image'

import AGJoiasIMG from '@/assets/brands/agjoias.svg'
import BCNOutdoorIMG from '@/assets/brands/bcnoutdoor.svg'
import CGEIMG from '@/assets/brands/cge.svg'
import ExaminusIMG from '@/assets/brands/examinus.svg'
import ExpressoIMG from '@/assets/brands/expresso.svg'
import FuteboladaIMG from '@/assets/brands/futebolada.svg'
import GeventIMG from '@/assets/brands/gevent.svg'
import CoachGuth from '@/assets/brands/gh.svg'
import JPIMG from '@/assets/brands/jp.svg'
import RJIMG from '@/assets/brands/rj.svg'
import SeturIMG from '@/assets/brands/secturismo.svg'
import SicnoticiasIMG from '@/assets/brands/sicnoticias.svg'
import SPMSIMG from '@/assets/brands/spms.svg'
import ZionStoryIMG from '@/assets/brands/zionstory.svg'

export type Brand = {
  src: StaticImageData
  alt: string
  w: number
}

export const BRANDS: Brand[] = [
  { src: SicnoticiasIMG, alt: 'SIC Notícias', w: 110 },
  { src: ExpressoIMG, alt: 'Expresso', w: 100 },
  { src: SPMSIMG, alt: 'SPMS', w: 80 },
  { src: ZionStoryIMG, alt: 'Zion Story', w: 60 },
  { src: ExaminusIMG, alt: 'Examinus', w: 100 },
  { src: FuteboladaIMG, alt: 'Futebolada', w: 90 },
  { src: BCNOutdoorIMG, alt: 'BCN Outdoor', w: 60 },
  { src: CoachGuth, alt: 'Coach Guth', w: 60 },
  { src: GeventIMG, alt: 'geVent', w: 90 },
  { src: JPIMG, alt: 'Jovens Protagonistas', w: 80 },
  { src: RJIMG, alt: 'RJ.gov', w: 70 },
  { src: SeturIMG, alt: 'Setur RJ', w: 80 },
  { src: CGEIMG, alt: 'CGE RJ', w: 80 },
  { src: AGJoiasIMG, alt: 'AG Joias', w: 80 },
]
