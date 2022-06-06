import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 16px;
  margin-bottom: 64px;

  form{
    *{
      margin: 8px 4px;
      padding: 0 8px;
      line-height: 32px;
      font-size: 14px;
    }

    button{
      min-width: 140px;
      border: none;
      border-radius: 4px;
      background-color: #5c6bc0;
      color: #FEFEFE;
      font-weight: 700;
    }
  }

  .errors-container{
    display: flex;
    flex-flow: column nowrap;

    .error-span{
        color: red;
        font-size: 12px;
    }
  }
`;
