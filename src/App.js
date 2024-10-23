import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import swal from "sweetalert2";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5;
  height: 100vh;
`;

const AuthContainer = styled.div`
  width: 300px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const MediaInput = styled.input`
  display: block; // (hide or show)  input field
`;

const Button = styled.button`
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

const PostContainer = styled.div`
  width: 400px;
  background-color: white;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const PostInput = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Post = styled.div`
  margin: 20px 0;
`;

const PostText = styled.p`
  font-size: 16px;
`;

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
        <Route path="/" element={<Home />} />
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
  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://abbey-r84a.onrender.com/api", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
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
        setPosts([...posts, response.data]);
        setNewPost("");
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };
  const handlePictureUpload = async (e) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/upload/image?title=${e.target.files[0].name}`,
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
      await axios.post(
        `https://abbey-r84a.onrender.com/api/posts/${postId}/like`,
        {},
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
              Like {post.likes}
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

// Register component
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "https://abbey-r84a.onrender.com/api/user/register",
        {
          email,
          username,
          password,
          confirm,
        }
      );
      swal.fire({
        title: "success",
        text: response.data.data.message,
        icon: "success",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error registering:", error.message);
      swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        dangerMode: false,
      });
    }
  };

  return (
    <AuthContainer>
      <h2>Register</h2>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="confirm"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <Button onClick={handleRegister}>Register</Button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthContainer>
  );
};

// Login component
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://abbey-r84a.onrender.com/api/user/login",
        {
          email,
          password,
        }
      );

      swal.fire({
        title: "success",
        text: response.data.data.message,
        icon: "success",
      });

      localStorage.setItem("token", response.data.data.token);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        dangerMode: false,
      });
    }
  };

  return (
    <AuthContainer>
      <h2>Login</h2>
      <Input
        type="text"
        placeholder="Username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin}>Login</Button>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </AuthContainer>
  );
};

export default App;
