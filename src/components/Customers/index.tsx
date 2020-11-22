import React from 'react';
import Image from 'next/image';

import BoxDescription from '../BoxDescription';

import { Section, BoxCustomers } from '@/styles/pages/Customers';

const Customers: React.FC  = () => (
  <Section id="customers">
    <BoxDescription
      title="Nossos"
      subtitle="Clientes"
      paragraph="Esses são alguns de nossos clientes e claro...
      Tem sempre espaço para mais um, como você."
      paragraph_two="Venha fazer parte, de nosso portifólio de clientes
      satisfeitos por nossos serviços"
    />

    <BoxCustomers>
      <article>
        <a href="http://rj.gov.br/" target="_blank">
          <Image
            src="/images/logo-govrj.svg"
            width={100}
            height={100}
            alt="Governo do Rio de Janeiro"
          />
        </a>
      </article>
      <article>
        <a href="http://guiadeturismo.rj.gov.br/" target="_blank">
          <Image
            src="/images/logo-guiadeturismo.svg"
            width={100}
            height={100}
            alt="Guia de Turismo RJ"
          />
        </a>
      </article>
      <article>
        <a href="#" target="_blank">
          <Image
            src="/images/logo-turismorj.svg"
            width={100}
            height={100}
            alt="Secretaria de Turismo do Estado do Rio de Janeiro"
          />
        </a>
      </article>
      <article>
        <a href="https://www.instagram.com/davibraga/" target="_blank">
          <Image
            src="/images/logo-jovensprotagonistas.svg"
            width={100}
            height={100}
            alt="Jovens Protagonistas"
          />
        </a>
      </article>
      <article>
        <a href="https://coritran.com.br" target="_blank">
          <Image
            src="/images/logo-coritran.svg"
            width={100}
            height={100}
            alt="CORITRAN"
          />
        </a>
      </article>
      <article>
        <a href="https://mrcomercioeservicos.com.br" target="_blank">
          <Image
            src="/images/logo-mrcomercioeservicos.svg"
            width={100}
            height={100}
            alt="MR Comércio e Serviços"
          />
        </a>
      </article>
      <article>
        <a href="https://andersongomesjoias.com.br" target="_blank">
          <Image
            src="/images/logo-agjoias.svg"
            width={100}
            height={100}
            alt="Anderson Gomes Jóias"
          />
        </a>
      </article>
      <article>
        <a href="https://edesignjoias.com.br" target="_blank">
          <Image
            src="/images/logo-edesignjoias.svg"
            width={100}
            height={100}
            alt="EDesign Jóias"
          />
        </a>
      </article>
      <article>
        <a href="#" target="_blank">
          <Image
            src="/images/logo-emgb.svg"
            width={100}
            height={100}
            alt="EMGB"
          />
        </a>
      </article>
      <article>
        <a href="https://trammax.eng.br" target="_blank">
          <Image
            src="/images/logo-trammax.svg"
            width={100}
            height={100}
            alt="TRAMMAX"
          />
        </a>
      </article>

    </BoxCustomers>
  </Section>
);

export default Customers;
