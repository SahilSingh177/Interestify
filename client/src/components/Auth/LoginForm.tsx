import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Flex, Input, Text, FormLabel } from "@chakra-ui/react";
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Redirect from "./Redirect";
import ShowAlert from "../Alert/Alert";
import { authState } from "@/atoms/userAtom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import firebase from 'firebase/app';
import { onAuthStateChanged } from "firebase/auth";
import {User,FirebaseAuth} from '@firebase/auth-types';

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
  const userInfo = useRecoilValue(authState);
  const [_, loadingAuthState, loadingAuthError] = useAuthState(auth);
  
  const waitForCurrentUser = () => {
    while (loadingAuthState) {
      if (loadingAuthError) {
        console.log("Couldn't set auth state");
        return;
      }
    }
    setUserState((prevState) => ({
      ...prevState,
      isLoggedIn: true,
      currentUser: user?.user,
    }));
    if (user?.user) console.log(user?.user.displayName);
  };
  
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  
    if (error) {
      console.log(error);
      return;
    }
  
    waitForCurrentUser();
    setLoginForm({ email: "", password: "" });
    Router.push("/select-preferences");
  };
  
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        {error && (<ShowAlert type="error" title={"Sorry!"} message={"Internal Server Error"} />)}
      </form>
    </Flex>
  )
};
export default LoginForm;
