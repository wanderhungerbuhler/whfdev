import styled from 'styled-components';

export const Nav = styled.nav`
  position: fixed;
  width: 90%;
  top: 0;
  margin: 5vh 5vw auto;
  z-index: 9999;

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 750px) {
    position: fixed;
    top: 0;
    width: 100%;
    margin:0;
    background: rgba(0,0,0, .7);
    z-index: 9999;

    justify-content: center;
    align-items: center;
    height: 100px;
  }

  .active-menu {
    color: #FF671F;
  }

`;

export const NavLinks = styled.div`
  a { color:#fff; padding: 0 20px; text-decoration: none; font-size: 1.2rem;
    transition: all .3s ease-in-out; text-transform: uppercase;

    &:hover { color:#FF671F; transition: all .3s ease-in-out; cursor: pointer; }
  }

  @media (max-width: 750px) {
    display: grid;
    margin-left: 20px;
    text-align: right;
  }
`;
