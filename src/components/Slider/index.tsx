import React from 'react';

import { SliderHome, SliderDecription } from '@/styles/pages/Slider';

const Slider: React.FC = () => (
  <SliderHome className="slider">
    <article className="active">
      <div style={{ width: '100%', height: '100%',
        backgroundImage: "url('/images/icon-frontend.svg')",
        backgroundPosition: '50% 40%',
        backgroundSize: '70%',
        backgroundRepeat: 'no-repeat'
      }} ></div>

      <SliderDecription>
        <span>Desenvolvimento Front-End</span>
        <p>Todo o visual é exclusivo e bem elaborado, para que assim você possa
          tirar o melhor proveito do seu projeto no Ar.
        </p>
      </SliderDecription>
    </article>

    <article>
      <div style={{ width: '100%', height: '100%',
        backgroundImage: "url('/images/icon-backend.svg')",
        backgroundPosition: '50% 40%',
        backgroundSize: '70%',
        backgroundRepeat: 'no-repeat'
      }} ></div>

      <SliderDecription>
        <span>Desenvolvimento Back-End</span>
        <p>As melhores regras de negócio e gestão de dados para seu site,
          e-commerce e aplicativo.
        </p>
      </SliderDecription>
    </article>

    <article>
      <div style={{ width: '100%', height: '100%',
        backgroundImage: "url('/images/icon-mobile.svg')" ,
        backgroundPosition: '40% 40%',
        backgroundSize: '45%',
        backgroundRepeat: 'no-repeat'
      }} ></div>

      <SliderDecription>
        <span>Desenvolvimento de Aplicativos</span>
        <p>Desenvolvimento de forma estratégica para sistemas Android e iOS.</p>
      </SliderDecription>
    </article>

    <article>
      <div style={{ width: '100%', height: '100%',
        backgroundImage: "url('/images/icon-socialmedia.svg')",
        backgroundPosition: '50% 40%',
        backgroundSize: '70%',
        backgroundRepeat: 'no-repeat'
      }} ></div>

      <SliderDecription>
        <span>Social Media</span>
        <p>Marketing Digital para seu negócio no Instagram, Facebook e agora WhatsApp!
        </p>
      </SliderDecription>
    </article>

    <article>
      <h1>Gostou?</h1>
      <p>O que ache de conhecer mais descendo a tela,
        ou se preferir, entre em contato conosco para fecharmos um grande projeto!
      </p>
    </article>
  </SliderHome>
);

export default Slider;
