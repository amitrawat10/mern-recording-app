import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [btnValue, setBtnValue] = useState("Login");
  const navigate = useNavigate();
  const { login } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");
    setEmailError("");
    setBtnValue("Please wait...");
    if (!name.trim() && !email.trim()) {
      setNameError("please enter the name");
      setEmailError("please enter the email");
      setBtnValue("Login");
      return;
    }
    if (!name.trim()) {
      setNameError("please enter the name");
      setBtnValue("Login");
      return;
    }
    if (!email.trim()) {
      setEmailError("please enter the email");
      setBtnValue("Login");
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      setEmailError("please enter a valid email");
      setBtnValue("Login");
      return;
    }
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_PATH}/api/v1/login`,
        {
          name,
          email,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (data && data.success) {
        // save
        login(data.user, true);
        navigate("/home");
        setBtnValue("Login");
      } else {
        setError(data.message);
        setBtnValue("Login");
      }
    } catch (error) {
      // console.log(error);
      setError(error.response.data.message);
      setBtnValue("Login");
    }
  };

  function handleNameChange(e) {
    setNameError("");
    setName(e.target.value);
  }

  function handleEmailChange(e) {
    setEmailError("");
    setEmail(e.target.value);
  }

  return (
    <div>
      <form className="submit-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          className={`input ${nameError ? "border-red" : ""}`}
          // required
          onChange={handleNameChange}
        />
        {nameError && <span className="input-error">{nameError}</span>}
        <input
          type="text"
          placeholder="Your email"
          value={email}
          className={`input ${emailError ? "border-red" : ""}`}
          // required
          onChange={handleEmailChange}
        />
        {emailError && <span className="input-error">{emailError}</span>}

        <button
          type="submit"
          className={`submit-btn ${btnValue !== "Login" ? "disabled" : ""}`}
          disabled={btnValue !== "Login" ? true : false}
        >
          {btnValue}
        </button>
        {error && <span className="name-error">{error}</span>}
      </form>
    </div>
  );
};

export default Login;
