import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Container } from './styles';

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function ChargeItem({ charge, refreshAll }) {
  const auth = useAuth();

  const payCharge = async () => {
    const payInput = { id: charge.id };

    try {
      await api.post('charges/pay', payInput);
      refreshAll();
    } catch (error) {
      // Signout if receives a unauthorized code
      if (error.response.status === 401) {
        auth.signOut();
      }
    }
    return null;
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
