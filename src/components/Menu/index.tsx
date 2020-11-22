import React from 'react';
import Image from 'next/image';

import { Link } from 'react-scroll';

import { Nav, NavLinks } from '@/styles/pages/Menu';

const Menu: React.FC = () => (
  <>
    <div>
      <Nav>
        <a href="#">
          <Image
            src="/images/logo.svg"
            width={144}
            height={55}
          />
        </a>

        <NavLinks>
          {/* <Link to="/#oquevoceprecisa" >O que você precisa</Link> */}
          <Link
            activeClass="active-menu"
            to="whataboutyou"
            spy={true}
            smooth={true}
            offset={-100}
            duration={700}
          >O que você precisa</Link>

          <Link
            activeClass="active-menu"
            to="about"
            spy={true}
            smooth={true}
            offset={-100}
            duration={700}
          >O que fazemos</Link>

          <Link
            activeClass="active-menu"
            to="customers"
            spy={true}
            smooth={true}
            offset={-100}
            duration={700}
          >Clientes</Link>

          <Link
            activeClass="active-menu"
            to="contact"
            spy={true}
            smooth={true}
            offset={-100}
            duration={700}
          >Contato</Link>
        </NavLinks>
      </Nav>
    </div>
  </>
);

export default Menu;
