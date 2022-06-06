import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Open Sans', sans-serif;
  }

  html, body,#root{
    height: 100%;
  }

  body{
    background: #fafafa;
    -webkit-font-smoothing: antialiased;
  }
  
  #root{
    display: flex;
    flex-flow: column nowrap;
  }

  button{
    cursor: pointer;
  }
`;
