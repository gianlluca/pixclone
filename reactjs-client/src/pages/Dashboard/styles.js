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

export const TabHeader = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TabSelector = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TabButton = styled.button.attrs({ type: 'button' })`
  white-space: nowrap;

  min-width: 140px;
  min-height: 32px;
  border: 1px solid #00000022;
  background-color: ${(props) => (props.isSelected ? '#499187' : '#EFEFEF')};
  color:  ${(props) => (props.isSelected ? '#FEFEFE' : '#A2A2A2')};
  font-weight: ${(props) => (props.isSelected ? '600' : '400')};

  transition: all 0.2s;

  &:first-child{
    border-radius: 4px 0 0 4px;
  }

  &:last-child{
    border-radius: 0 4px 4px 0;
  }

  &:hover{
    filter: brightness(0.9);
  }
`;

export const NewOpButton = styled.button.attrs({ type: 'button' })`
  white-space: nowrap;

  min-width: 140px;
  min-height: 32px;
  border: none;
  border-radius: 4px;
  background-color: #545f9d;
  color: #FEFEFE;
  font-weight: 700;

  transition: all 0.2s;

  &:hover{
    filter: brightness(0.8);
  }
`;
