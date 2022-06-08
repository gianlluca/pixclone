import styled from 'styled-components';

export const Container = styled.div`
  h4{
    color: #3a3a3a;
  }

  form{
    margin-top: 16px;
    display: flex;
    flex-flow: column nowrap;
  }

  .select-buttons{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    margin: 4px 0;
  }

  .action-buttons{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-top: 24px;
  }

  .error-span{
    color: red;
    font-size: 12px;
  }
`;

export const Input = styled.input`
  margin: 4px 0;
  height: 42px;
  font-size: 16px;
  padding: 0 8px;
  border: 1px solid #c2c2c2;
  border-radius: 4px;
`;

const OpButton = styled.button`
  line-height: 32px;
  padding: 0 16px;
  color: #efefef;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  white-space: nowrap;

  transition: all 0.2s;

  &:hover{
    filter: brightness(0.8);
    box-shadow: none;
  }
`;

export const CancelOpButton = styled(OpButton)`
  background-color: #d14343;
`;

export const ConfirmOpButton = styled(OpButton)`
  background-color: #545f9d;
`;

export const OpTypeSelect = styled.button`
  white-space: nowrap;
  min-height: 42px;
  width: 100%;
  border: 1px solid #00000022;
  border-radius: 4px;
  background-color: ${(props) => (props.isSelected ? '#499187' : '#EFEFEF')};
  color:  ${(props) => (props.isSelected ? '#FEFEFE' : '#A2A2A2')};
  font-size: 14px;
  font-weight: ${(props) => (props.isSelected ? '600' : '400')};

  transition: all 0.2s;

  &:hover{
    filter: brightness(0.9);
  }

  &:first-child{
    margin-right: 4px;
  }
  &:last-child{
    margin-left: 4px;
  }
`;
