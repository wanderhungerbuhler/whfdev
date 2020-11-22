import React from 'react'
import Image from 'next/image';

import { Section, BoxImage } from '@/styles/pages/Inovar';

import BoxDescription from '../BoxDescription';

const Inovar: React.FC = () => (
  <Section id="whataboutyou">
    {/* <div className="arrow-scroll"></div> */}
    <BoxDescription
      title="Você precisa"
      subtitle="Inovar"
      paragraph="É um dos passos mais importantes, quando você deseja fazer a diferença
      em seu negócio, seja ele físico ou digital."
      paragraph_two="Por isso, estamos totalmente dedicados em ajudar você, que precisa fazer
      aquele projeto e sonho sair do papel."
    />

    <BoxImage>
      <Image
        src="/images/icon-artificial-intelligence.svg"
        width={600}
        height={500}
        alt="Artificial Intelligence"
      />
    </BoxImage>
  </Section>
);

export default Inovar;
