import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Flex, Input, Text, FormLabel } from "@chakra-ui/react";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Redirect from "./Redirect";
import ShowAlert from "../Alert/Alert";
import { authState } from "@/atoms/userAtom";
import { useSetRecoilState } from "recoil";
import firebase from 'firebase/app';
import { onAuthStateChanged } from "firebase/auth";

const LoginForm = () => {
  const setUserState = useSetRecoilState(authState);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const Router = useRouter();

  const waitForCurrentUser = () => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserState((prevState) => ({
          ...prevState,
          isLoggedIn: true,
          currentUser: user,
        }));
        console.log(user.displayName);
      }
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
    if (error){
       console.log(error);
       return;
    }
    else waitForCurrentUser();
    setLoginForm({email:"",password:""});
    Router.push("/select-preferences");
  };
  

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <Flex width="49vw" padding="10vw">
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
        <Button variant="success" width="100%" height="50px" mt={2} mb={2} type="submit" isLoading={loading}>
          Log In
        </Button>
        <Redirect view="login"></Redirect>
        {error && (<ShowAlert type="error" title={"Sorry!"} message={"Internal Server Error"} />)}
        {user &&
          <ShowAlert type="success" title="Congratulations" message="Successfully logged in"></ShowAlert>
        }
      </form>
    </Flex>
  )
};
export default LoginForm;
