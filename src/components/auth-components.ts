import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;
export const Title = styled.h1`
  font-size: 42px;
  margin-bottom: 50px;
  font-weight: 600;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
`;
export const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  // 타입이 submit인 경우 스타일 적용
  &[type='submit'] {
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    //hover된 상태에서는
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-size: 600;
  color: tomato;
  text-align: center;
`;

export const Switcher = styled.span`
  margin-top: 10px;
  a {
    color: #1d9bf0;
    text-decoration: none;
  }
`;

export const Button = styled.button`
  text-decoration: none;
  color: #1d9bf0;
  background-color: black;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  font-size: 15px;
`;
