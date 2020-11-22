import React from 'react';

import { Section, BoxTools } from '@/styles/pages/About';


import Image from 'next/image';

import BoxDescription from '../BoxDescription';

const About: React.FC = () => (
  <Section id="about">

    <BoxTools>
      <article>
        <div>
          <Image
            src="/images/icon-frontend.svg"
            width={100}
            height={100}
            alt="Desenvolvimento Front-End"
          />
        </div>
        <div>
          <span>Desenvolvimento Front-End</span>
          <p>Todo o visual é exclusivo e bem elaborado,
            para que assim você possa tirar o melhor proveito do seu projeto no Ar.</p>
        </div>
      </article>

      <article>
        <div>
          <Image
            src="/images/icon-backend.svg"
            width={100}
            height={100}
           alt="Desenvolvimento Back-End"
          />
        </div>
        <div>
          <span>Desenvolvimento Back-End</span>
          <p>As melhores regras de negócio e gestão de dados para seu site,
            e-commerce e aplicativo.</p>
        </div>
      </article>

      <article>
        <div>
          <Image
            src="/images/icon-mobile.svg"
            width={100}
            height={100}
            alt="Desenvolvimento de Aplicativos"
          />
        </div>
        <div>
          <span>Desenvolvimento de Aplicativos</span>
          <p>Desenvolvimento de forma estratégica para sistemas Android e iOS.</p>
        </div>
      </article>

      <article>
        <div>
          <Image
            src="/images/icon-socialmedia.svg"
            width={100}
            height={100}
            alt="Social Media"
          />
        </div>
        <div>
          <span>Social Media</span>
          <p>Marketing Digital para seu negócio no Instagram, Facebook e agora WhatsApp!</p>
        </div>
      </article>
    </BoxTools>

    <BoxDescription
      title="O que"
      subtitle="Fazemos"
      paragraph="Planejamos e desenvolvemos como será montado seu website,
       aplicativo ou e-commerce de forma exclusiva e de acordo com sua necessidade.
       Além de um café diferenciado."
      paragraph_two=""
    />
  </Section>
);

export default About;
