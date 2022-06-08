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

  .react-modal-overlay{
    background: rgba(0, 0, 0, 0.5);

    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-modal-content{
    max-width: 476px;
    width: 100%;
    background: #FEFEFE;
    padding: 32px;
    border: 1px solid #C2C2D2;
    border-radius: 8px;
  }
`;
