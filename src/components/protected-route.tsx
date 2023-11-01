// 홈페이지와 프로필 스크린을 보호하는 컴포넌트
// 홈페이지와 프로필이 children으로 들어옴

import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
    // 현재 로그인된 유저의 정보를 넘겨줌
  const user = auth.currentUser;

  if (user === null) { // 저장된 사용자가 아니면 로그인 페이지로
    return <Navigate to='/login' />; 
  }
  return children; // 로그인 된 사용자면 홈페이지와 프로필에 접근할 수 있도록 children을 넘겨줌
}
