import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { Container } from './styles';

const transactionSchema = yup.object().shape({
  username: yup.string()
    .min(4, 'Usuario precisa ter pelo menos 4 caracteres')
    .required('Usuario é um campo obrigatório'),
  value: yup.number()
    .typeError('O campo valor precisa ter um número')
    .min(1, 'A transação precisa ter um valor maior ou igual a 1')
    .required('Valor é um campo obrigatório'),
});

export function NewTransaction({ balance, refreshAll }) {
  const auth = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(transactionSchema),
  });

  const [errorMessage, setErrorMessage] = useState('');

  const onNewTransaction = async (inputNewTransaction) => {
    const transaction = {
      username: inputNewTransaction.username,
      value: inputNewTransaction.value,
    };

    try {
      await api.post('transactions/new', transaction);
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
      <strong>Nova Transação:</strong>
      <form onSubmit={handleSubmit(onNewTransaction)}>
        <label htmlFor="rusername">
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
            {...register('value', { valueAsNumber: true, min: 1 })}
            type="number"
            step="0.50"
            max={balance}
            placeholder="50.00"
            onChange={() => { setErrorMessage(''); }}
          />
        </label>
        <button type="submit">Nova Transação</button>
      </form>
      <div className="errors-container">
        {errors.username && <span className="error-span">{errors.username?.message}</span>}
        {errors.value && <span className="error-span">{errors.value?.message}</span>}
        {errorMessage !== '' && <span className="error-span">{errorMessage}</span>}
      </div>
    </Container>
  );
}
