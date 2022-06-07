import { useAuth } from '../../hooks/useAuth';
import { PayCharge } from '../../services/api';
import { Container } from './styles';

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function ChargeItem({ charge, refreshAll }) {
  const auth = useAuth();

  const payCharge = async () => {
    await PayCharge(charge.id);
    refreshAll();
  };

  return (
    <Container userMade={charge.receiver_id !== auth.userInfo.id}>
      <span>{`De: ${charge.sender.display_name}`}</span>
      <span>{`Para: ${charge.receiver.display_name}`}</span>
      <span>{`Data: ${new Date(charge.created_at).toLocaleDateString('pt-BR')}`}</span>
      <span>{`Horario: ${new Date(charge.created_at).toLocaleTimeString('pt-BR')}`}</span>
      <span>{`Valor: ${formatter.format(charge.value)}`}</span>
      <span>{charge.paid ? 'Pago: Sim' : 'Pago: Não'}</span>
      {
        (!charge.paid && charge.receiver_id === auth.userInfo.id) && (
          <button type="button" onClick={payCharge}>
            Pagar
          </button>
        )
      }
    </Container>
  );
}
