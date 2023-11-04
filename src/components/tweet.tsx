import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
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
    display: flex;
    align-items: center;
  }
`;
const Username = styled.span`
  padding: 0px 5px;
  font-size: 18px;
  font-weight: 600;
`;
const Payload = styled.p`
  padding: 5px;
  margin: 10px 0px;
  font-size: 15px;
`;
const Photo = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 15px;
`;

const DeleteButton = styled.button`
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  color: tomato;
  background-color: black;
  border: 2px solid tomato;
  width: 70px;
  padding: 5px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;

export default function Tweet({ username, tweet, photo, userId, id }: ITweet) {
  const user = auth.currentUser;
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
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>

      {photo ? (
        <Column id='photo'>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
