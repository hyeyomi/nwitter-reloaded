import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import {
  Wrapper,
  Title,
  Form,
  Input,
  Error,
  Switcher,
} from '../components/auth-components';
import GithubButton from '../components/github-btn';

// const errors = {
//   "auth/weak-password" : "Your password is too weak. Password should be at least 6 characters".
// }

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  //HTML의 INPUT에 대한 CHANGE이벤트를 위한 함수
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || name === '' || email === '' || password === '') return;
    try {
      setLoading(true);
      //create an account
      // createUserWithEmailAndPassword을 성공하면 자격 증명을 받게 되고 즉시 로그인됨, 존재하는 이메일이거나 비밀번호가 틀렸을 시에는 실패함
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user); // 유저의 정보를 제공함, 이름,이메일,비밀번호가 출력됨

      //set the name of the user
      //로그인 후 유저의 name정보로 프로필을 업데이트 함
      await updateProfile(credentials.user, {
        displayName: name,
      });

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
    console.log(name, email, password);
  };
  return (
    <Wrapper>
      <Title>JOIN</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name='name'
          value={name}
          placeholder='name'
          type='text'
        />
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
        <Input
          type='submit'
          value={isLoading ? 'Loading...' : 'Create Account'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to='/login'>Sign in &rarr;</Link>
      </Switcher>
      <GithubButton />
      
    </Wrapper>
  );
}
//로그인과 계정 만들기 라우트가 레이아웃에 들어가지 않기를 바람
//즉, 로그인과 계정만들기는 레이아웃에 감싸지지 않음, 오직 로그인 된 회원들만 레이아웃에 감싸진 페이지를 볼 수 있음
