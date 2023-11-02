import styled from 'styled-components';
import { ITweet } from './timeline';
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 2px solid rgba(255,255,255,50%);
  border-radius: 20px;
  margin-bottom: 25px;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  &[id=photo]{
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
export default function Tweet({ username, tweet, photo }: ITweet) {
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
      </Column>

      {photo ? (
        <Column id='photo'>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
