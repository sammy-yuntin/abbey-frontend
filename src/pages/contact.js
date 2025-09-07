import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Img } from "../styledComponents";
import {
  AppContainer,
  PostContainer,
  Post,
  PostText,
  PostInput,
} from "../styledComponents";

// Home component to display Contacts
const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [phone, setPhone] = useState("");
  const [fullname, setFullname] = useState("");
  const [comments, setComments] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  // Example API endpoint to fetch Contacts (Replace with your own)
  const handleContactFetch = async () => {
    try {
      const response = await axios.get(
        "https://abbey-r84a.onrender.com/api/contact/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContacts([...response.data.data.details.rows]);

      setPhone("");
      setFullname("");
    } catch (error) {
      console.error("Error fetching Contacts:", error);
      if (error.response.data.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (token) {
      handleContactFetch();
    } else {
      navigate("/login");
    }
  }, [token]);

  const handleContactSubmit = async () => {
    if (phone.trim() && fullname.trim()) {
      try {
        const response = await axios.post(
          "https://abbey-r84a.onrender.com/api/contact/new",
          { phone, fullname },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);

        setContacts([...contacts, response.data.data.details]);

        //setContacts([]);
      } catch (error) {
        console.error("Error creating Contact:", error);
      }
    }
  };

  return (
    <AppContainer>
      <PostContainer>
        <h2>Create Contact</h2>
        <Input
          placeholder="Phone Number"
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          value={phone}
        />
        <Input
          placeholder="Full Name"
          value={fullname}
          type="text"
          onChange={(e) => setFullname(e.target.value)}
        />
        <div>
          <Button onClick={handleContactSubmit}>Save Contact</Button>
        </div>
      </PostContainer>

      {contacts.map((item) => (
        <PostContainer key={item.id}>
          <Post>
            <PostText>{item.phone}</PostText>
            <PostText>{item.fullname}</PostText>
          </Post>
        </PostContainer>
      ))}
    </AppContainer>
  );
};
export default Contact;
