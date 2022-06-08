import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from 'react-modal';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateCharge, CreateTransaction } from '../../services/api';
import {
  CancelOpButton, ConfirmOpButton, Container, Input, OpTypeSelect,
} from './styles';

const operationSchema = yup.object().shape({
  username: yup.string()
    .min(4, 'Usuario precisa ter pelo menos 4 caracteres')
    .required('Usuario é um campo obrigatório'),
  value: yup.number()
    .typeError('O campo valor precisa ter um número')
    .min(1, 'A transação precisa ter um valor maior ou igual a 1')
    .required('Valor é um campo obrigatório'),
});

export function NewOpModal({
  isOpen, onRequestClose, balance, refreshAll,
}) {
  Modal.setAppElement('#root');

  const {
    register, handleSubmit, formState: { errors }, reset,
  } = useForm({
    resolver: yupResolver(operationSchema),
  });

  const [operationType, setOperationType] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCancelOp = () => {
    reset({ username: '', value: '' });
    setOperationType(0);
    setErrorMessage('');
    onRequestClose();
  };

  const onNewOperation = async (inputNewOperation) => {
    const operation = {
      username: inputNewOperation.username,
      value: inputNewOperation.value,
    };

    const rErrorMessage = operationType === 0
      ? await CreateTransaction(operation)
      : await CreateCharge(operation);

    if (rErrorMessage) {
      setErrorMessage(rErrorMessage);
    } else {
      onRequestClose();
      refreshAll();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCancelOp}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <Container>
        <h4>Nova Operação:</h4>
        <form onSubmit={handleSubmit(onNewOperation)}>
          <Input
            {...register('username')}
            placeholder="Nome de usuário"
            onChange={() => { setErrorMessage(''); }}
          />
          {errors.username && <span className="error-span">{errors.username?.message}</span>}
          <Input
            {...register('value', { valueAsNumber: true, min: 1 })}
            type="number"
            step="0.50"
            max={balance}
            placeholder="Valor"
            onChange={() => { setErrorMessage(''); }}
          />
          {errors.value && <span className="error-span">{errors.value?.message}</span>}
          <div className="select-buttons">
            <OpTypeSelect
              type="button"
              isSelected={operationType === 0}
              onClick={() => setOperationType(0)}
            >
              Transferência
            </OpTypeSelect>
            <OpTypeSelect
              type="button"
              isSelected={operationType === 1}
              onClick={() => setOperationType(1)}
            >
              Cobrança
            </OpTypeSelect>
          </div>
          {errorMessage && <span className="error-span">{errorMessage}</span>}
          <div className="action-buttons">
            <CancelOpButton type="button" onClick={handleCancelOp}>Cancelar</CancelOpButton>
            <ConfirmOpButton type="submit">Confirmar</ConfirmOpButton>
          </div>
        </form>
      </Container>
    </Modal>
  );
}
