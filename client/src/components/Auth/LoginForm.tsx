import React, { useState } from "react";
import { Button, Flex, Input, Text,FormLabel } from "@chakra-ui/react";
import { ModalView } from "../../atoms/authModalAtom";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Redirect from "./Redirect";
import ShowAlert from "../Alert/alert";

const LoginForm= () => {
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createUserWithEmailAndPassword(signupForm.email,signupForm.password);
  };

  const onChange =(event:React.ChangeEvent<HTMLInputElement>) =>{
    setSignupForm(prev=>({
      ...prev,
      [event.target.name]:event.target.value,
    }))
  }

  return (
    <Flex width="49vw" padding="10vw">
    <form onSubmit={onSubmit} >
    <FormLabel color="white">Email address</FormLabel>
      <Input
      required
        name="email"
        placeholder="email"
        type="text"
        width="25vw"
        height="7.5vh"
        mb={2}
        onChange={onChange}
        bg="blue.800"
        border="blue.400"
      />
      <FormLabel color="white">Password</FormLabel>
      <Input
      required
        name="password"
        placeholder="password"
        type="password"
        width="25vw"
        height="7.5vh"
        mb={2}
        onChange={onChange}
        bg="blue.800"
        border="blue.400"
      />
      <Button variant="success" width="100%" height="50px" mt={2} mb={2} type="submit" isLoading={loading}>
        Sign Up
      </Button>
      <Redirect view="login"></Redirect>
      {error && (
        <ShowAlert type="error" title={"Alas!"} message="Couldn't Log In" />
      )}
    </form>
    </Flex>
  );
};
export default LoginForm;
