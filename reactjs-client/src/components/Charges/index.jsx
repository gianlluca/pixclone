import { ChargeItem } from '../ChargeItem';
import { Container } from './styles';

export function Charges({ props }) {
  return (
    <Container>
      <strong>Cobranças:</strong>
      {
        props.charges.map(
          (charge) => <ChargeItem key={charge.id} charge={charge} refreshAll={props.refreshAll} />,
        )
      }
    </Container>
  );
}
