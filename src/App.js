import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import swal from "sweetalert2";
import Login from "./pages/login";
import Register from "./pages/register";
import Contact from "./pages/contact";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  MediaInput,
  AppContainer,
  PostContainer,
  Button,
  Post,
  PostText,
  AuthContainer,
  Input,
  PostInput,
} from "./styledComponents";

const MediaInputField = ({ onChange }) => {
  return (
    <div>
      <MediaInput
        id="media-input"
        type="file"
        accept="image/*,video/*"
        onChange={onChange}
      />
    </div>
  );
};

const LikeButton = styled.button`
  background: none;
  border: none;
  color: #1877f2;
  cursor: pointer;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 5px;
  margin-top: 10px;
`;

const Comments = styled.div`
  margin-top: 10px;
`;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

// Home component to display posts
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [media, setMedia] = useState(null);
  const [comments, setComments] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  // Example API endpoint to fetch posts (Replace with your own)
  const handlePostFetch = async () => {
    try {
      const response = await axios.get(
        "https://abbey-r84a.onrender.com/api/post/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data.data.details);
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (token) {
      handlePostFetch();
    } else {
      navigate("/login");
    }
  }, [token]);

  const handlePostSubmit = async () => {
    if (newPost.trim()) {
      try {
        const response = await axios.post(
          "https://abbey-r84a.onrender.com/api/post/",
          { text: newPost, image: media },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPosts([...posts, response.data.data.details]);

        setNewPost("");
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };
  const handlePictureUpload = async (e) => {
    try {
      const response = await axios.post(
        `https://abbey-r84a.onrender.com/api/upload/image`,
        { thumbnail: e.target.files[0] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      // setPosts([...posts, response.data]);
      // setNewPost("");
    } catch (error) {
      console.error("Error uploading Picture:", error);
      /* swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        dangerMode: false,
      }); */
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.patch(
        `https://abbey-r84a.onrender.com/api/post/like/${postId}`,
        { like: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  const handleUnLike = async (postId) => {
    try {
      await axios.patch(
        `https://abbey-r84a.onrender.com/api/post/like/${postId}`,
        { like: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId, comment) => {
    if (comment.trim()) {
      try {
        await axios.post(
          `https://abbey-r84a.onrender.com/api/posts/${postId}/comment`,
          { text: comment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments({ ...comments, [postId]: "" });
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  return (
    <AppContainer>
      <PostContainer>
        <h2>Create Post</h2>
        <PostInput
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <div>
          <MediaInputField onChange={handlePictureUpload} />
          <Button onClick={handlePostSubmit}>Post</Button>
        </div>
      </PostContainer>

      {posts.map((post) => (
        <PostContainer key={post.id}>
          <Post>
            <PostText>{post.text}</PostText>

            <LikeButton onClick={() => handleLike(post.id)}>
              Likes: {post.likes}
            </LikeButton>
            <LikeButton onClick={() => handleUnLike(post.id)}>
              Unlike
            </LikeButton>
          </Post>
          <Comments>
            <CommentInput
              type="text"
              placeholder="Write a comment..."
              value={comments[post.id] || ""}
              onChange={(e) =>
                setComments({ ...comments, [post.id]: e.target.value })
              }
              onKeyDown={(e) =>
                e.key === "Enter" && handleComment(post.id, comments[post.id])
              }
            />
          </Comments>
        </PostContainer>
      ))}
    </AppContainer>
  );
};

export default App;
