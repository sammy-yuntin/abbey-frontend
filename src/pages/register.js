import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { AuthContainer, Button, Input, Img } from "../styledComponents";

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
      <Img
        src={`https://res.cloudinary.com/dahdgwqgy/image/upload/v1757251016/wishvent/uewdu499bclnjyg3fslb.webp`}
        alt="logo"
      />
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
export default Register;
