import { TransactionItem } from '../TransactionItem';
import { Container } from './styles';

export function Transactions({ transactions }) {
  return (
    <Container>
      <strong>TransferĂȘncias:</strong>
      {
        transactions.map(
          (transaction) => <TransactionItem key={transaction.id} transaction={transaction} />,
        )
      }
    </Container>
  );
}
