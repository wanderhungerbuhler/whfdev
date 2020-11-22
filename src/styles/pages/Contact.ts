import styled, { css } from 'styled-components';

export const Section = styled.section`
  max-width: 1360px;
  width: 90%;
  margin: 200px auto;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  justify-content: space-between;

 div {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 15px;

  span { font-size: 5rem; color: #111; text-transform: uppercase;
    text-shadow: 1px 0 #FF671F, -1px 0 #FF671F, 0 1px #FF671F, 0 -1px #FF671F,
    1px 1px #FF671F, -1px -1px #FF671F, -1px 1px #FF671F, 1px -1px #FF671F;
    text-align: right; }

  cite { font-size: 1.75rem; color:#FF671F; text-align: right; }
  }
`;

export const Forms = styled.div`
  background: #0B0B0B;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  label { font-size: 1.50rem; color:#fff; }


  textarea { background: transparent; border: 1px solid #111; color:#fff;
    resize: none; margin-top: 10px; padding: 10px;

    &:focus { border-color: #FF671F; }
  }

  h2 { font-size: 3rem; color: #fff; padding: 15px; }

  button {
    height: 70px;
    border: 0;
    background: #111;
    color: #fff;
    font-size: 1.5rem;
    text-transform: uppercase;
    font-weight: bold;
    transition: all .7s ease-in-out;

    &:hover { background: #FF671F; transition: all .7s ease-in-out;}
  }

  .messageSend {
    margin-top: 20px;

    span { font-size: 1rem; display:block; color: #fff; text-align: center; text-shadow: none;
      &.success-message { background: #19d13e; padding: 20px; font-weight: bold; font-size: 1.5em; }
      &.error-message { background: #d13219; }
    }
  }


`;
