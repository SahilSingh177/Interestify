import React, { useState } from "react";
import { Button, Flex, Input, FormLabel, Box } from "@chakra-ui/react";
import { useAuthState, useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Redirect from "./Redirect";
import ShowAlert from "../Alert/Alert";
import { useSetRecoilState } from "recoil";
import { authState } from '../../atoms/userAtom'
import { useRouter } from "next/router";

const SignupForm = () => {
  const Router = useRouter();
  const setUserState = useSetRecoilState(authState);
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);
  
  const [updateProfile, updating, ProfileError] = useUpdateProfile(auth);
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
      isLoggedIn: true
    }));
    if (user?.user) console.log(user?.user.displayName);
  };
  
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    // handle password validation (e.g., check length, match, etc.)
    // if (signupForm.password !== signupForm.confirmPassword)
    
  
    await createUserWithEmailAndPassword(signupForm.email, signupForm.password);
    await updateProfile({ displayName: signupForm.username });
    await updateProfile({ photoURL: '/assets/default_profile_photo.png' });
  
    if (error) {
      console.log(error);
      return;
    }
  
    waitForCurrentUser();
    setSignupForm({ username: "", email: "", password: "", confirmPassword: "" });
    Router.push("/select-preferences");
  };
  
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  

  return (
    <Flex width="50vw" padding="5vw 10vw">
      <form onSubmit={onSubmit} >
        <FormLabel color="white">Username</FormLabel>
        <Input
          required
          name="username"
          placeholder="username"
          type="text"
          width="25vw"
          height="7.5vh"
          mb={2}
          onChange={onChange}
          bg="blue.800"
          border="blue.400"
        />
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
        <FormLabel color="white">Confirm Password</FormLabel>
        <Input
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          width="25vw"
          height="7.5vh"
          mb={2}
          onChange={onChange}
          bg="blue.800"
          border="blue.400"
        />
        <Button variant="success" width="25vw" height="50px" mt={5} mb={2} size="lg" type="submit" isLoading={loading}>
          Sign Up
        </Button>
        <Redirect view="signup"></Redirect>
        {/* //Already here . Click to Signin
      //Implement with Recoil */}
      </form>

      {error && (
        <ShowAlert
          type="error"
          title="Sorry!"
          message={"Internal Server Error"}
        />
      )}
    </Flex>
  )
};
export default SignupForm;
