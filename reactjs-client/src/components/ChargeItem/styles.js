import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 32px;
  padding: 8px 32px;
  border: 1px solid #dedede;
  border-radius: 6px;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  align-items: center;

  background-color: ${(props) => (!props.userMade ? '#ffcdd2' : '#bbdefb')};

  span{
    flex: 1;
    white-space: nowrap;
  }

  button{
    flex: 1;
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    background-color: #d32f2f;
    color: #FEFEFE;
    font-weight: 700; 
  }
`;
