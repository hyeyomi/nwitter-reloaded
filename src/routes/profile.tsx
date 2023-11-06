import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  cursor: pointer;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const NameContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Name = styled.span`
  font-size: 22px;
  margin-left: 22px;
`;
const Tweets = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
const EditNameBtn = styled.span`
  color: white;
  background-color: black;
  width: fit-content;
  font-size: 22px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    opacity: 1;
    color: #1d9bf0;
  }
  svg {
    width: 15px;
    height: 15px;
    opacity: 0.8;
  }
`;
const NameEditInput = styled.input`
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 50%);
  background-color: #eee;
  width: 50%;
  background-color: black;
  padding: 5px 10px;
  margin-left: 40px;
  margin-right: 5px;
  color: white;
  font-size: 15px;
  &:focus {
    outline: none;
  }
`;
export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [nameEdit, setNameEdit] = useState(false);
  const [name, setName] = useState(user?.displayName);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      //사용자 별 프로필 사진을 저장하기 위해서, 새로운 버킷 ref를 만들어줌
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const fetchTweet = async () => {
    if (!user) return;
    const tweetsQuery = query(
      collection(db, 'tweets'),
      where('userId', '==', user.uid), //조건
      //firestore에 내가 어떤 조건으로 필터링을 힐 것인지 알려줘야 함 => 자동으로 인덱스 만들어라고 오류가 뜸
      orderBy('createdAt', 'desc'),
      limit(25)
    );
    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, username, createdAt, userId, photo } = doc.data();
      return {
        tweet,
        username,
        createdAt,
        userId,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweet();
  }, []);

  const onEditName = async () => {
    if (!user) return;
    setNameEdit((prev) => !prev);
    console.log(user?.displayName);
    await updateProfile(user, {
      displayName: name,
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  return (
    <Wrapper>
      <AvatarUpload htmlFor='avatar'>
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6'
          >
            <path
              fillRule='evenodd'
              d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z'
              clipRule='evenodd'
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id='avatar'
        type='file'
        accept='image/*'
      />
      <NameContainer>
        {nameEdit ? (
          <NameEditInput onChange={onChange}></NameEditInput>
        ) : (
          <Name>{user?.displayName ? user.displayName : 'Anonymous'}</Name>
        )}
        <EditNameBtn onClick={onEditName}>
          {nameEdit ? (
            '✔'
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6'
            >
              <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z' />
            </svg>
          )}
        </EditNameBtn>
      </NameContainer>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
