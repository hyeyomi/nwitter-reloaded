import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { useState } from 'react';
const Wrapper = styled.div`
  display: grid;
  //grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 2px solid rgba(255, 255, 255, 50%);
  border-radius: 20px;
  margin-bottom: 25px;
  &:hover{
    border: 2px solid rgba(255, 255, 255, 30%);
  }
  transition: all 0.2s ease-in-out;
`;
const Column = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  &[id='photo'] {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const Username = styled.span`
  padding: 0px 5px;
  font-size: 18px;
  font-weight: 600;
  margin-left: 5px;
`;
const Payload = styled.p`
  white-space: pre-wrap;
  padding: 5px;
  margin-top: 5px;
  font-size: 17px;
  line-height: 1.5em;
  max-height: fit-content;
  font-weight: 600;
`;
const Photo = styled.img`
  width: 230px;
  height: 180px;
  border-radius: 10px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0px;
  right: 0px;
  color: white;
  opacity: 0.5;
  display: flex;
  justify-items: center;
  align-items: center;
  background-color: black;
  border: none;
  width: 28px;
  height: 28px;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
    background-color: #ffffff3f;
  }
`;

const EditButton = styled.button`
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  color: tomato;
  opacity: 0.5;
  background-color: black;
  border: 2px solid #ff6347d4;
  width: 60px;
  padding: 3px 5px;
  border-radius: 2px;
  margin-left: 15px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    opacity: 1;
    //color: white;
  }
`;
const Div = styled.div`
  margin-top: 25px;
  margin-left: -10px;
  display: flex;
  justify-content: space-between;

`;

const TextArea = styled.textarea`
opacity: 0.8;
  width: 90%;
  resize: none;
  margin: 12px 0px;
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  color: white;
  background-color: black;
  border: 2px solid white;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  //hover된 상태에서는
  &:hover {
    opacity: 0.8;
  }
`;

const EditPhotoBtn = styled.label`
  z-index: 2;
  position: absolute;
  left: 67px;
  top: 188px;
  width: 100px;
  height: 70px;
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const EditPhotoInput = styled.input`
  display: none;
`;

const Date = styled.div`
  padding: 0px 5px;
  opacity: 0.8;
  margin-left: 5px;
  margin-bottom: -10px;
  font-weight: 600;
  font-size: 13px;
  width: fit-content;

`;

const ProfileImg = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  svg{
    width: 45px;
    height: 45px;
     border-radius: 50%;
  }
`;

const Email = styled.span`
  font-size: 13px;
  font-weight: 500;
  opacity: 0.8;
`

const PhotoContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 5px;
`
const LikeButton = styled.button`
  color: pink;
  padding: 3px 5px;
  width: 60px;
  background-color: black;
  border: 2px solid white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 2px;
  cursor: pointer;
  svg{
    width: 22px;
  }
`
const LikeText = styled.span`
  color: white;
  font-size: 15px;

`

export default function Tweet({
  username,
  tweet,
  photo,
  userId,
  id,
  date,
}: ITweet) {
  const [edit, setEdit] = useState<boolean>(false);
  const [changeTweet, setTweet] = useState(tweet);
  const [changeFile, setFile] = useState<File | null>(null);
  const user = auth.currentUser;
  const [profileImg] = useState(user?.photoURL);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onDelete = async () => {
    const ok = confirm('Are you sure you want to delete this tweet?');
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onEdit = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setEdit((prev) => !prev);
    try {
      await updateDoc(doc(db, 'tweets', id), {
        tweet: changeTweet,
        //createdAt:Date.now(),
      });
      console.log(changeTweet);
      if (changeFile) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, changeFile);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, 'tweets', id), {
          photo: url,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onPhotoEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size < 1 * 1024 * 1024) {
      setFile(files[0]);
    }
  };

  return (
    <Wrapper>
      <Column>
        <User>
          {profileImg && user?.uid === userId ? (
            <ProfileImg src={profileImg} />
          ) : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clip-rule="evenodd" />
        </svg>
        
        }
          <Username>{username} <Email>@{user?.email?.split('@')[0]}</Email>           <DeleteButton onClick={onDelete}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>

            </DeleteButton>
          </Username>
        </User>
        {edit ? (
          <TextArea
            value={changeTweet}
            rows={2}
            maxLength={150}
            onChange={onChange}
          ></TextArea>
        ) : (
          <Payload>{tweet}</Payload>
        )}

{photo ? (
        <PhotoContainer id='photo'>
          {edit ? (
            <>
              <EditPhotoBtn htmlFor='changeFile'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z'
                  />
                </svg>
              </EditPhotoBtn>
              <EditPhotoInput
                type='file'
                accept='image/*'
                id='changeFile'
                onChange={onPhotoEdit}
              ></EditPhotoInput>
            </>
          ) : null}
          <Photo src={photo} />
        </PhotoContainer>
      ) : null}

        <Date>{date}</Date>
        {user?.uid === userId ? (
          <Div>
            <EditButton onClick={onEdit}>{edit ? 'OK' : 'Edit'}</EditButton>
            <LikeButton><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
</svg> 
<LikeText>0</LikeText>
</LikeButton>
          </Div>
        ) : null}
      </Column>

    </Wrapper>
  );
}
