import { ChargeItem } from '../ChargeItem';
import { Container } from './styles';

export function Charges({ charges, refreshAll }) {
  return (
    <Container>
      <strong>Cobranças:</strong>
      {
        charges.map(
          (charge) => <ChargeItem key={charge.id} charge={charge} refreshAll={refreshAll} />,
        )
      }
    </Container>
  );
}
