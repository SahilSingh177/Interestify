import React, { useState } from "react";
import { Button, Flex, Input, FormLabel, Box } from "@chakra-ui/react";
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Redirect from "./Redirect";
import ShowAlert from "../Alert/ShowAlert";
import { useRouter } from "next/router";

const SignupForm = () => {
  const Router = useRouter();
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
  const [customErrorMessage,setCustomErrorMessage] = useState<string>('');


  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (signupForm.password !== signupForm.confirmPassword) {
      setCustomErrorMessage('Passwords do not match');
      return;
    }
    
    if (signupForm.password.length < 6) {
      setCustomErrorMessage('Password should be at least 6 characters long');
      return;
    }

    try {
      await createUserWithEmailAndPassword(signupForm.email, signupForm.password);
      await updateProfile({ displayName: signupForm.username });
      await updateProfile({ photoURL: '/assets/default_profile_photo.png' });
  
      await fetch("https://nikhilranjan.pythonanywhere.com/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: signupForm.email, username: signupForm.username }),
      });
  
      setSignupForm({ username: "", email: "", password: "", confirmPassword: "" });
      Router.push("/welcome/categories");
    } catch (error) {
      console.log(error);
      setCustomErrorMessage('Internal Server Error');
    }
  };
  

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomErrorMessage('');
    setSignupForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };


  return (
    <Flex width={['100vw','100vw','100vw','50vw']} padding="10vw" paddingTop={['5vh','5vh','5vh','10vh']} 
    alignItems='center' justifyContent='center'>
      <form onSubmit={onSubmit} >
        <FormLabel color="white">Username</FormLabel>
        <Input
          required
          name="username"
          placeholder="username"
          type="text"
          width={['75vw','75vw','75vw','25vw']}
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
          type="email"
          width={['75vw','75vw','75vw','25vw']}
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
          width={['75vw','75vw','75vw','25vw']}
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
          width={['75vw','75vw','75vw','25vw']}
          height="7.5vh"
          mb={2}
          onChange={onChange}
          bg="blue.800"
          border="blue.400"
        />
        <Flex width='full' alignItems='center' justifyContent='center'>
        <Button variant="success" width="25vw" height="50px" mt={5} mb={2} size="lg" type="submit" isLoading={loading}>
          Sign Up
        </Button>
        </Flex>
        <Redirect view="signup"></Redirect>
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
export default SignupForm;
