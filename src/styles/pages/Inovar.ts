import styled from 'styled-components';

export const Section = styled.section`
  max-width: 1360px;
  width: 90%;
  margin: 200px auto;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 10px;
  justify-content: space-between;

  .arrow-scroll {
    position: fixed;
    width: 120px;
    height: 100px;
    top: 200px;
    margin: 10vw 40vw;
    background: url('/images/icon-arrow-scroll.svg') no-repeat center center;
    background-size: 100%;
    display:block;
    z-index: 9999;
  }
`;

export const BoxImage = styled.article`
  height: 400px;
`;
