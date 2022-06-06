import { TransactionItem } from '../TransactionItem';
import { Container } from './styles';

export function Transactions({ props }) {
  return (
    <Container>
      <strong>Transações:</strong>
      {props.transactions.map(
        (transaction) => <TransactionItem key={transaction.id} transaction={transaction} />,
      )}
    </Container>
  );
}
