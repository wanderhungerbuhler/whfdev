import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{margin:0; padding:0; box-sizing:border-box; outline: 0;}
  html {
    scroll-behavior: smooth;
  }
  body {
    height: 100vh;
    background: #111111;
    font-family: 'Poppins', sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  html, body, input, button {
    font-size: 62.5%;
  }
  button {
    cursor: pointer;
  }
    /* width */
  ::-webkit-scrollbar {
    width: 7px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: #111;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #FF671F;
    border-radius: 50px;
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`;