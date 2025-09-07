import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { AuthContainer, Button, Input, Img } from "../styledComponents";

// Login component
const Login = () => {
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://abbey-r84a.onrender.com/api/user/login",
        {
          emailUsername,
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
      <Img
        src={`https://res.cloudinary.com/dahdgwqgy/image/upload/v1757251016/wishvent/uewdu499bclnjyg3fslb.webp`}
        alt="logo"
      />
      <h2>Login</h2>
      <Input
        type="text"
        placeholder="Email or Username"
        value={emailUsername}
        onChange={(e) => setEmailUsername(e.target.value)}
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

export default Login;
