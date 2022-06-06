import { Container, SignOutButton, UserInfo } from './styles';
import pixicon from '../../assets/pixicon.svg';
import { useAuth } from '../../hooks/useAuth';

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function Header() {
  const auth = useAuth();

  return (
    <Container>
      <div>
        <div className="pix-logo">
          <img src={pixicon} alt="pix-icon" />
          <p>PixClone</p>
        </div>
        {
          auth.userInfo != null && (
            <UserInfo>
              <div>
                <p>{`Bem Vindo, ${auth.userInfo.display_name}`}</p>
                <p>{`Saldo: ${formatter.format(auth.userInfo.balance)}`}</p>
              </div>
              <SignOutButton type="button" onClick={auth.signOut}>
                Sign Out
              </SignOutButton>
            </UserInfo>
          )
        }
      </div>
    </Container>
  );
}
