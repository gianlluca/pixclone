import { useAuth } from '../../hooks/useAuth';
import { Container } from './styles';

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function TransactionItem({ transaction }) {
  const auth = useAuth();

  return (
    <Container userMade={transaction.receiver_id === auth.userInfo.id}>
      <span>{`De: ${transaction.sender.display_name}`}</span>
      <span>{`Para: ${transaction.receiver.display_name}`}</span>
      <span>{`Data: ${new Date(transaction.created_at).toLocaleDateString('pt-BR')}`}</span>
      <span>{`Horario: ${new Date(transaction.created_at).toLocaleTimeString('pt-BR')}`}</span>
      <span>{`Valor: ${formatter.format(transaction.value)}`}</span>
    </Container>
  );
}
