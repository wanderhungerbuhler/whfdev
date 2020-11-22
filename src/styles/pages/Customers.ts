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

export const BoxCustomers = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  justify-content: center;
  align-items: center;

  article {
    width: 190px;
    height: 190px;
    margin: 0 auto;
    margin-bottom: 10px;
    background: #0B0B0B;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .5s ease-in-out;

    &:hover { cursor: pointer; transform: scale(1.05);
      transition: all .5s ease-in-out; border: 1px solid #FF671F; }

    img { width: 145px; height: 145px; }
  }
`;
