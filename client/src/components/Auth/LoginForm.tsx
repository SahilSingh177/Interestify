import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Flex, Input, Text, FormLabel } from "@chakra-ui/react";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Redirect from "./Redirect";
import ShowAlert from "../Alert/ShowAlert";

const LoginForm = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [customErrorMessage, setCustomErrorMessage] = useState<string>('');

  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const Router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await signInWithEmailAndPassword(loginForm.email, loginForm.password);

    if (error) {
      if (error.code === 'auth/wrong-password') {
        console.log('yayy')
        setCustomErrorMessage('Wrong password. Please try again.');
      } else {
        console.log(error);
      }
      return;
    }
    else{
      setLoginForm({ email: "", password: "" });
      Router.push("/");
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomErrorMessage('');
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Flex width="50vw" padding="10vw" alignItems='center'>
      <form onSubmit={onSubmit}>
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
        <Button variant="success" size='lg' width="25vw" height="50px" mt={5} mb={2} type="submit" isLoading={loading}>
          Log In
        </Button>
        <Redirect view="login"></Redirect>
      </form>
      {customErrorMessage && (
        <ShowAlert
          type="error"
          title="Sorry!"
          message={customErrorMessage}
        />
      )}
    </Flex>
  )
};
export default LoginForm;