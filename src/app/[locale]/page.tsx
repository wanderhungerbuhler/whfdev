import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Nav } from '@/components/sections/Nav'
import { Process } from '@/components/sections/Process'
import { Services } from '@/components/sections/Services'
import { Work } from '@/components/sections/Work'

export default function Home() {
  return (
    <>
      <Nav />
      <main className="bg-canvas">
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
