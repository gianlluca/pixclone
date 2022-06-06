import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { Container } from './styles';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const chargeSchema = yup.object().shape({
  username: yup.string()
    .min(4, 'Usuario precisa ter pelo menos 4 caracteres')
    .required('Usuario é um campo obrigatório'),
  value: yup.number()
    .typeError('O campo valor precisa ter um número')
    .min(1, 'A cobrança precisa ter um valor maior ou igual a 1')
    .required('Valor é um campo obrigatório'),
});

export function NewCharge({ refreshAll }) {
  const auth = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(chargeSchema),
  });

  const [errorMessage, setErrorMessage] = useState('');

  const onNewCharge = async (inputNewCharge) => {
    const charge = {
      username: inputNewCharge.username,
      value: inputNewCharge.value,
    };

    try {
      await api.post('charges/new', charge);
      refreshAll();
      return null;
    } catch (error) {
      // Signout if receives a unauthorized code
      if (error.response.status === 401) {
        auth.signOut();
        return null;
      }
      // returns an error message to show
      setErrorMessage(error.response.data.message);
      return null;
    }
  };

  return (
    <Container>
      <strong>Nova Cobrança:</strong>
      <form onSubmit={handleSubmit(onNewCharge)}>
        <label htmlFor="username">
          Para:
          <input
            {...register('username')}
            placeholder="Nome de usuario"
            onChange={() => { setErrorMessage(''); }}
          />
        </label>
        <label htmlFor="value">
          Valor:
          <input
            type="number"
            step="0.50"
            placeholder="50.00"
            {...register('value', { valueAsNumber: true, min: 1 })}
            onChange={() => { setErrorMessage(''); }}
          />
        </label>
        <button type="submit">Nova Cobrança</button>
      </form>
      <div className="errors-container">
        {errors.username && <span className="error-span">{errors.username?.message}</span>}
        {errors.value && <span className="error-span">{errors.value?.message}</span>}
        {errorMessage !== '' && <span className="error-span">{errorMessage}</span>}
      </div>
    </Container>
  );
}
