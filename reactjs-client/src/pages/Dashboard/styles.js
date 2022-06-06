import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 16px auto 0 auto;
  color: #242424;

  strong{
    color: #404040;
  }

  input{
    width: 160px;
    line-height: 32px;
    font-size: 12px;
    background-color: #FFFFFF;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 4px;
    padding: 0 8px;
  }
`;

export const Center = styled.div`
  width: 100%;
  height: 100%;
  color: #242424;

  display: flex;
  align-items: center;
  justify-content: center;
`;
