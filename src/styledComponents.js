// Styled components
import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5;
  height: 100vh;
`;
export const Img = styled.img`
  width: inherit;
  height: 250px;
`;
export const AuthContainer = styled.div`
  width: 300px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: auto;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export const MediaInput = styled.input`
  display: block; // (hide or show)  input field
`;

export const Button = styled.button`
  background-color: #1877f2;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;

  &:hover {
    background-color: #145dbb;
  }
`;

export const PostContainer = styled.div`
  width: 400px;
  background-color: white;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const PostInput = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export const Post = styled.div`
  margin: 20px 0;
`;

export const PostText = styled.p`
  font-size: 16px;
`;
