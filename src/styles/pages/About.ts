import styled from 'styled-components';

export const Section = styled.section`
  max-width: 1360px;
  width: 90%;
  margin: 200px auto;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 10px;
  justify-content: space-between;
`;

export const BoxTools = styled.div`

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  grid-gap: 10px;

  article {
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #0B0B0B;
    color: #fff;
    text-align: center;
    padding: 20px;

    span { font-size: 1.75rem; line-height: 20px; font-weight: bold;
      margin-top: 50px; display: block; }

    p { font-size: 1rem; color: #ccc; margin-top: 10px; }

    &:nth-child(4) img {
      width: 180px;
      height: 180px;
      margin-top: -40px;
      margin-bottom: -50px;
    }

    @media (max-width: 750px) {
      height: 350px;
    }

  }
`;
