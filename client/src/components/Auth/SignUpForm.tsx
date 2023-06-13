import React, { useState } from "react";
import { Button, Flex, Input, FormLabel, Box } from "@chakra-ui/react";
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
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
    userCredential,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  const [updateProfile, updating, ProfileError] = useUpdateProfile(auth);
  const [success, setSuccess] = useState(false);

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

    // if (signupForm.password !== signupForm.confirmPassword) 
    // handle password validation (e.g., check length, match, etc.)

    await createUserWithEmailAndPassword(signupForm.email,signupForm.password)
    await updateProfile({ displayName: signupForm.username })
    if (error){
       console.log(error);
       return;
    }
    waitForCurrentUser();
    setSuccess(true);
    setSignupForm({username:"",email:"",password:"",confirmPassword:""});
    Router.push("/select-preferences");
  };


  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <Flex width="49vw" padding="5vw 10vw">
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
        <Button variant="success" width="100%" height="50px" mt={2} mb={2} size="lg" type="submit" isLoading={loading}>
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
      {success &&
        <ShowAlert type="success" title="Congratulations" message="Successfully logged in"></ShowAlert>
      }
    </Flex>
  )
};
export default SignupForm;
