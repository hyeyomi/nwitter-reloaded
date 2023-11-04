import React, { useState } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  resize: none;
  border: 2px solid white;
  border-radius: 20px;
  padding: 20px;
  background-color: black;
  font-size: 16px;
  color: white;
  transition: all 0.2s ease-in-out;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  cursor: pointer;
  color: #1d9bf0;
  padding: 10px 0px;
  border: 1px solid #1d9bf0;
  border-radius: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
`;
const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null); // 타입스크립트 구문
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === '' || tweet.length > 300) return;
    try {
      setLoading(true);
      //doc을 반환해줌
      const doc = await addDoc(collection(db, 'tweets'), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid,
      });
      if (file) {
        //파일 이름을 포함하여 파일의 전체 경로를 가리키는 참조 만들기
        //우리는 업로드된 파일이 저장되는 폴더 명과 파일명을 지정할 수 있음
        const locationRef = ref(
          storage,
          `tweets/${user.uid}/${doc.id}`
        );

        //적절한 참조를 만들었으면 uploadBytes() 메서드를 호출해 스토리지에 파일 업로드
        const result = await uploadBytes(locationRef, file);
        // getDownloadURL() 메서드를 호출하여 파일의 다운로드 URL을 가져오기
        const url = await getDownloadURL(result.ref);
        //doc에 이미지 url 추가하기 위해서, updateDoc을 호출함, 업데이트 할 document와 업데이트 할 데이터를 필요로 함
        await updateDoc(doc, {
          photo: url,
        });
      }
      setTweet('');
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size <  1 * 1024 * 1024) {
      setFile(files[0]);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={320}
        placeholder='what is happening?'
        value={tweet}
        onChange={onChange}
      />
      <AttachFileButton htmlFor='file'>
        {file ? 'Photo added ' : 'Add Photo'}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type='file'
        id='file'
        accept='image/*'
      />
      <SubmitBtn
        type='submit'
        value={isLoading ? 'Posting...' : 'Post Tweet'}
      />
    </Form>
  );
}
