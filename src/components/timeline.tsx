import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';

export interface ITweet {
  id: string;
  photo?: string; // ?란 required가 아니라는 의미, 사지은 없을 수도 있으니까
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}
const Wrapper = styled.div``;
export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]); // ITweet 배열이 들어갈 것이고, 디폴트는 빈 배열이다.

  //트윗 불러오기
  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, 'tweets'),
      orderBy('createdAt', 'desc')
    );
    //트잇 읽기 getDocs()
    const querySnapshot = await getDocs(tweetsQuery);
    // 읽어들인 트윗을 저장하기, ITweet 형식에 맞춰서 추출함
    //배열을 반환하는 map함수를 사용해서 트윗들을 형식에 맞춰서 추출한 후에 저장함
    const tweets = querySnapshot.docs.map((doc) => {
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
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
