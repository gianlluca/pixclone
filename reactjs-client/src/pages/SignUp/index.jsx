import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Container } from './styles';

const signUpSchema = yup.object().shape({
  username: yup.string().required('Usuário é um campo obrigatório'),
  display_name: yup.string().required('Nome é um campo obrigatório'),
  password: yup.string().required('Senha é um campo obrigatório'),
  confirm_password: yup.string()
    .required('Confirmar senha é um campo obrigatório')
    .oneOf([yup.ref('password'), null], 'Senhas não coincidem'),
});

export function SignUp() {
  const navigate = useNavigate();
  const auth = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const [errorMessage, setErrorMessage] = useState('');

  const onSignUp = async (inputSignUp) => {
    const userData = {
      username: inputSignUp.username,
      display_name: inputSignUp.display_name,
      password: inputSignUp.password,
    };

    const message = await auth.signUp(userData);
    setErrorMessage(message);
  };

  useEffect(() => {
    // If already is signed in redirect to dashboard page
    if (auth.token) { navigate('/dashboard'); }
  }, [auth.token]);

  return (
    <Container>
      <div>
        <h2>Criar conta:</h2>
        <form onSubmit={handleSubmit(onSignUp)}>
          <input type="text" {...register('username')} placeholder="Nome de usuario" />
          {errors.username && <span className="error-span">{errors.username?.message}</span>}
          <input type="text" {...register('display_name')} placeholder="Nome completo" />
          {errors.display_name && <span className="error-span">{errors.display_name?.message}</span>}
          <input type="password" {...register('password')} placeholder="Senha" />
          {errors.password && <span className="error-span">{errors.password?.message}</span>}
          <input type="password" {...register('confirm_password')} placeholder="Confirmar senha" />
          {errors.confirm_password && <span className="error-span">{errors.confirm_password?.message}</span>}
          {errorMessage !== '' && <span className="error-span">{errorMessage}</span>}
          <button type="submit">Registrar</button>
        </form>
        <Link to="/signin">Já tenho conta</Link>
      </div>
    </Container>
  );
}
