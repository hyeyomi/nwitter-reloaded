import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Button = styled.span`
  background-color: white;
  color: black;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 20px;
  display: flex;
  gap: 5px;
  border: none;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button onClick={onClick}>
      <Logo src='/github-logo.svg' />
      Continue with Github
    </Button>
  );
}
