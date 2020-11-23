import React from 'react';
import Head from 'next/head';

import Menu from '@/components/Menu';
import Slider from '@/components/Slider';
import Inovar from '@/components/Inovar';
import About from '@/components/About';
import Customers from '@/components/Customers';
import Contact from '@/components/Contact';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>WHFdev - Desenvolvimento de Sistemas e Aplicativos</title>
      </Head>
      <Menu />
      <Slider />
      <Inovar />
      <About />
      <Customers />
      <Contact />
    </>
  );
}

export default Home;
