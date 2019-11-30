import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto 0;
`;

export const Box = styled.div`
  /* box-shadow: 0 4px 8px rgba(0,0,0,0.08); */
  /* box-shadow: 0 15px 10px #777; */
  padding: 0.1px 0;
  transition: all ease 0.5s;
  border-radius: 5px;
  /* border: 1px solid #fafafa; */
  background-color: #FFF;
  position: relative;

  /* &::after, &::before {
    z-index: -1;
    position: absolute;
    content: "";
    bottom: 15px;
    left: 10px;
    width: 50%;
    top: 80%;
    max-width:300px;
    background: #777;
  }

  &::after {
    transform: rotate(3deg);
    right: 10px;
    left: auto;
  } */

  &:hover {
    box-shadow: 0 24px 24px rgba(0,0,0,0.1);
  }
`;
