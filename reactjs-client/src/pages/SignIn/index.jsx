import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../hooks/useAuth';
import { Container } from './styles';

const signInSchema = yup.object().shape({
  username: yup.string().required('Usuário é um campo obrigatório'),
  password: yup.string().required('Senha é um campo obrigatório'),
});

export function SignIn() {
  const navigate = useNavigate();
  const auth = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signInSchema),
  });
  const [errorMessage, setErrorMessage] = useState('');

  const onSignIn = async (inputSignIn) => {
    const userData = {
      username: inputSignIn.username,
      password: inputSignIn.password,
    };

    const message = await auth.signIn(userData);
    setErrorMessage(message);
  };

  useEffect(() => {
    // If already is signed in redirect to dashboard page
    if (auth.token) { navigate('/dashboard'); }
  }, [auth.token]);

  return (
    <Container>
      <div>
        <h2>Entrar:</h2>
        <form onSubmit={handleSubmit(onSignIn)}>
          <input type="text" {...register('username')} placeholder="Nome de usuario" />
          {errors.username && <span className="error-span">{errors.username?.message}</span>}
          <input type="password" {...register('password')} placeholder="Senha" />
          {errors.password && <span className="error-span">{errors.password?.message}</span>}
          {errorMessage !== '' && <span className="error-span">{errorMessage}</span>}
          <button type="submit">Login</button>
        </form>
        <Link to="/signup">Criar conta</Link>
      </div>
    </Container>
  );
}
