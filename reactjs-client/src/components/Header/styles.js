import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  min-height: 80px;
  background-color: #499187;
  box-shadow: 0 1px 2px 1px #00000088;
  justify-content: space-between;

  div{
    display: flex;
    padding: 0 16px;
    max-width: 1120px;
    width: 100%;
    align-items: center;
    margin: 0 auto;

    .pix-logo{

      img{
        height: 48px;
        width: 48px;
      }

      p{
        display: flex;
        margin-left: 8px;
        font-weight: 700;
        color: #F2F2F2;
        font-size: 24px;
      }
    }
  }
`;

export const UserInfo = styled.div`
  align-items: center;
  gap: 8px;

  div{
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    padding: 0 16px;

    p{
      color: #fff;
      font-weight: 600;
      white-space: nowrap;
    }
  }
`;

export const SignOutButton = styled.button.attrs({ type: 'button' })`
  line-height: 32px;
  background: #14635a;
  box-shadow: 1px 1px 2px #00000088;
  padding: 0 16px;
  color: #efefef;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  white-space: nowrap;

  transition: all 0.2s;

  &:hover{
    filter: brightness(1.2);
    box-shadow: none;
  }
`;
