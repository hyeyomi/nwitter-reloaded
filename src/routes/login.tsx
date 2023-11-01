import { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import {
  Wrapper,
  Title,
  Form,
  Input,
  Error,
  Switcher,
  Button,
} from '../components/auth-components';
import GithubButton from '../components/github-btn';

// const errors = {
//   "auth/weak-password" : "Your password is too weak. Password should be at least 6 characters".
// }

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  //HTML의 INPUT에 대한 CHANGE이벤트를 위한 함수
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || email === '' || password === '') return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      //create an account
      // createUserWithEmailAndPassword을 성공하면 자격 증명을 받게 되고 즉시 로그인됨, 존재하는 이메일이거나 비밀번호가 틀렸을 시에는 실패함
      // 유저의 정보를 제공함, 이름,이메일,비밀번호가 출력됨

      //set the name of the user
      //로그인 후 유저의 name정보로 프로필을 업데이트 함

      //redirect to the home page
      // 로그인 완료 후 홈페이지로 이동
      navigate('/');
    } catch (e) {
      //setError
      if (e instanceof FirebaseError) {
        //console.log(e.code,e.message);
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

const onClick = () => {
  sendPasswordResetEmail(auth,email);
  console.log(email);
}

  return (
    <Wrapper>
      <Title>Sign iN</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name='email'
          value={email}
          placeholder='Email'
          type='email'
          required
        />
        <Input
          onChange={onChange}
          name='password'
          value={password}
          placeholder='password'
          type='password'
          required
        />
        <Input type='submit' value={isLoading ? 'Loading...' : 'Sign in'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{' '}
        <Link to='/create-account'>Create one &rarr;</Link>
      </Switcher>
      <GithubButton />
      <Button onClick={onClick}>Forgot Password?</Button>
    </Wrapper>
  );
}
