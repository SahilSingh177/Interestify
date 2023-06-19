import React, { useState, useEffect } from "react";
import { Button, Flex, Input, FormLabel, Box } from "@chakra-ui/react";
import { useAuthState, useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Redirect from "./Redirect";
import ShowAlert from "../Alert/Alert";
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
    await fetch("http://127.0.0.1:5000/registerUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: signupForm.email, username: signupForm.username }),
    });
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
