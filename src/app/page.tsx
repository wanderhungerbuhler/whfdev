/* eslint-disable react/no-unescaped-entities */
'use client'
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import LogoSVG from '@/app/assets/logo.svg';
import FlagENSVG from '@/app/assets/flag-en.svg';
import FlagFRSVG from '@/app/assets/flag-fr.svg';
import FlagBRSVG from '@/app/assets/flag-br.svg';
import ChooseTheBestLanguageForYou from '@/app/assets/choose-language.svg';

import SicnoticiasIMG from '@/app/assets/brands/sicnoticias.svg';
import GeventIMG from '@/app/assets/brands/gevent.svg';
import JPIMG from '@/app/assets/brands/jp.svg';
import RJIMG from '@/app/assets/brands/rj.svg';
import SeturIMG from '@/app/assets/brands/secturismo.svg';
import GuiaTurismoIMG from '@/app/assets/brands/guiaturismo.svg';
import CGEIMG from '@/app/assets/brands/cge.svg';
import AGJoiasIMG from '@/app/assets/brands/agjoias.svg';

export default function Home() {
  const [flag, setFlag] = useState('en');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play the initial audio when the component mounts
    if (audioRef.current && flag === 'en') {
      audioRef.current.play();
    }
  }, []);


  function handleChangeLanguage(language: string) {
    setFlag(language);
    const audioPath = `/audios/audio_wanderhungerbuhler_${language}.mp3`;

    if (audioRef.current) {
      audioRef.current.src = audioPath;
      audioRef.current.load();
      audioRef.current.play();
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] bg-primary">

      <div className="max-sm:w-full w-[980px] m-auto grid grid-cols-2 p-5">
        <Image
          src={LogoSVG}
          alt="WHFdev - Logo"
        />

        <div className="flex gap-5 justify-end max-sm:pr-5">
          <button
            onClick={() => handleChangeLanguage('en')}
            disabled={flag === 'en'}
            className="disabled:opacity-[1] opacity-[0.5]"
          >
            <Image src={FlagENSVG} alt="Flag EN" />
            <audio ref={audioRef} autoPlay>
              <source src="/audios/audio_wanderhungerbuhler_en.mp3" type="audio/ogg" />
              <source src="/audios/audio_wanderhungerbuhler_en.mp3" type="audio/mpeg" />
            </audio>
          </button>

          <button
            onClick={() => handleChangeLanguage('fr')}
            disabled={flag === 'fr'}
            className="disabled:opacity-[1] opacity-[0.5]"
          >
            <Image src={FlagFRSVG} alt="Flag FR" />
            <audio ref={audioRef} autoPlay>
              <source src="/audios/audio_wanderhungerbuhler_fr.mp3" type="audio/ogg" />
              <source src="/audios/audio_wanderhungerbuhler_fr.mp3" type="audio/mpeg" />
            </audio>
          </button>

          <button
            onClick={() => handleChangeLanguage('br')}
            disabled={flag === 'br'}
            className="disabled:opacity-[1] opacity-[0.5]"
          >
            <Image src={FlagBRSVG} alt="Flag BR" />
            <audio ref={audioRef} autoPlay>
              <source src="/audios/audio_wanderhungerbuhler_br.mp3" type="audio/ogg" />
              <source src="/audios/audio_wanderhungerbuhler_br.mp3" type="audio/mpeg" />
            </audio>
          </button>
        </div>
      </div>


      {!flag ? (
        <>
          <div className="max-sm:w-[70%] w-[55%] m-auto flex justify-end items-center">
            <Image
              src={ChooseTheBestLanguageForYou}
              alt="Choose the best language for you"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex max-sm:h-auto h-[70vh] gap-5 justify-center items-center m-auto max-sm:flex-col">
            {flag === 'en' ? (
              <>
                <Image
                  width={70}
                  height={70}
                  className="rounded-full border-[3px] border-gray-300"
                  src="https://github.com/wanderhungerbuhler.png"
                  alt="Wander Hungerbühler - Profile"
                />
                <div className="flex flex-col w-[630px] max-sm:justify-center max-sm:items-center max-sm:text-center">
                  <span className="max-sm:text-2xl text-2xl block text-gray-100 font-semibold">Hello, I'm Wander Hungerbühler.</span>
                  <p className="max-sm:text-sm max-sm:w-[60%] w-[580px] text-sm text-gray-200 leading-[25px] mt-5">
                    I currently work as a Front-end Developer and Mobile Developer.
                    But yes, I have worked at companies like FullStack and I continue working on
                    personal projects and improving my skills with a greater focus on applications.
                  </p>
                  <p className="text-[15px] text-gray-200 max-sm:w-[50%] leading-[25px] mt-5">
                    Below you will find some of the projects I have done...
                  </p>
                </div>
              </>
            ) : flag === 'fr' ? (
              <>
                <Image
                  width={70}
                  height={70}
                  className="rounded-full border-[3px] border-gray-300"
                  src="https://github.com/wanderhungerbuhler.png"
                  alt="Wander Hungerbühler - Profile"
                />
                <div className="flex flex-col w-[630px] max-sm:justify-center max-sm:items-center max-sm:text-center">
                  <span className="max-sm:text-2xl max-sm:w-[50%] text-2xl block text-gray-100 font-semibold">Bonjour, je m'appelle Wander Hungerbühler.</span>
                  <p className="max-sm:text-sm max-sm:w-[60%] w-[580px] text-sm text-gray-200 leading-[25px] mt-5">
                    Je travaille actuellement en tant que développeur Front-end et développeur mobile.
                    Mais oui, jai travaillé dans des entreprises comme FullStack et
                    je continue à travailler sur des projets personnels et à améliorer mes
                    compétences en me concentrant davantage sur les applications.
                  </p>
                  <p className="text-sm text-gray-200 max-sm:w-[50%] leading-[25px] mt-5">
                    Vous trouverez ci-dessous quelques-uns des projets que j'ai réalisés...
                  </p>
                </div>
              </>
            ) : flag === 'br' && (
              <>
                <Image
                  width={70}
                  height={70}
                  className="rounded-full border-[3px] border-gray-300"
                  src="https://github.com/wanderhungerbuhler.png"
                  alt="Wander Hungerbühler - Profile"
                />
                <div className="flex flex-col w-[630px] max-sm:justify-center max-sm:items-center max-sm:text-center">
                  <span className="max-sm:text-2xl max-sm:w-[50%] text-2xl block text-gray-100 font-semibold">Olá, meu nome é Wander Hungerbühler</span>
                  <p className="max-sm:text-sm max-sm:w-[60%] w-[580px] text-sm text-gray-200 leading-[25px] mt-5">
                    Atualmente trabalho como Desenvolvedor Front-end e Desenvolvedor Mobile.
                    Mas sim, eu já trabalhei em empresas como FullStack e continuo atuando em
                    projetos pessoais e aperfeiçoando minhas skills com um maior foco em aplicativos.
                  </p>
                  <p className="text-sm text-gray-200 max-sm:w-[50%] leading-[25px] mt-5">
                    Abaixo você encontra alguns dos projetos que já fiz...
                  </p>
                </div>
                </>
            )}
          </div>

          <ul className="max-sm:w-[50%] m-auto max-sm:grid max-sm:grid-cols-2 flex justify-center items-center gap-5 mt-5">
            <li>
              <a href="https://sicnoticias.pt" target="_blank">
                <Image src={SicnoticiasIMG} alt="Sic Notícias" />
              </a>
            </li>

            <li>
              <a href="https://gevent.vercel.app/" target="_blank">
                <Image src={GeventIMG} alt="geVent" />
              </a>
            </li>

            <li>
              <a href="https://jovensprotagonistas.vercel.app/" target="_blank">
                <Image src={JPIMG} alt="Jovens Protagonistas" />
              </a>
            </li>

            <li>
              <a href="http://rj.gov.br" target="_blank">
                <Image src={RJIMG} alt="RJ.gov" />
              </a>
            </li>

            <li>
              <a href="https://seturweb.netlify.app/" target="_blank">
                <Image src={SeturIMG} alt="Secretiria de Tusimo do Estado do Rio de Janeiro" />
              </a>
            </li>

            <li>
              <a href="#" target="_blank">
                <Image src={GuiaTurismoIMG} alt="Guia de Turismo RJ" />
              </a>
            </li>

            <li>
              <a href="http://www.cge.rj.gov.br/" target="_blank">
                <Image src={CGEIMG} alt="Controladoria Geral do Estado do Rio de Janeiro" />
              </a>
            </li>

            <li>
              <a href="https://andersongomesjoias.com.br/" target="_blank">
                <Image src={AGJoiasIMG} alt="Anderson Gomes Jóias" />
              </a>
            </li>
          </ul>
        </>
      )}



    </div>
  )
}
