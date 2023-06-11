import React, { useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";


const Login= () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //Firebase Logic
  };

  const onChange =(event:React.ChangeEvent<HTMLInputElement>) =>{
    setLoginForm(prev=>({
      ...prev,
      [event.target.name]:event.target.value,
    }))
  }

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="text"
        mb={2}
        onChange={onChange}
      />
      <Input
      required
        name="password"
        placeholder="password"
        type="password"
        onChange={onChange}
      />
      <Button width="100%" height="36px" mt={2} mb={2} type="submit">
        Log In
      </Button>
      {/* //New here . Click to Signup
      //Implement with Recoil */}
    </form>
  );
};
export default Login;
