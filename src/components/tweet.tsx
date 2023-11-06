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
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 2px solid rgba(255, 255, 255, 50%);
  border-radius: 20px;
  margin-bottom: 25px;
`;
const Column = styled.div`
  display: flex;
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
`;
const Payload = styled.p`
  white-space: pre-wrap;
  padding: 5px;
  margin: 10px 0px;
  font-size: 15px;
  line-height: 1.5em;
  max-height: fit-content;
`;
const Photo = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 15px;
`;

const DeleteButton = styled.button`
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: tomato;
  background-color: black;
  border: 2px solid #ff6347d4;
  width: 70px;
  padding: 5px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;

const EditButton = styled.button`
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: tomato;
  background-color: black;
  border: 2px solid #ff6347d4;
  width: 70px;
  padding: 5px;
  border-radius: 10px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;
const Div = styled.div`
  margin-top: 10px;
  display: flex;
`;

const TextArea = styled.textarea`
  width: 100%;
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
  width: 60px;
  height: 60px;
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const EditPhotoInput = styled.input`
  display: none;
`;

export default function Tweet({ username, tweet, photo, userId, id }: ITweet) {
  const [edit, setEdit] = useState<boolean>(false);
  const [changeTweet, setTweet] = useState(tweet);
  const [changeFile, setFile] = useState<File | null>(null);
  const user = auth.currentUser;
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
      if(changeFile){
        const locationRef = ref(
          storage,
          `tweets/${user.uid}/${id}`,
        );
        const result = await uploadBytes(locationRef, changeFile);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db,'tweets',id), {
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
        <Username>{username}</Username>
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

        {user?.uid === userId ? (
          <Div>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            <EditButton onClick={onEdit}>{edit ? 'OK' : 'Edit'}</EditButton>
          </Div>
        ) : null}
      </Column>

      {photo ? (
        <Column id='photo'>
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
        </Column>
      ) : null}
    </Wrapper>
  );
}
