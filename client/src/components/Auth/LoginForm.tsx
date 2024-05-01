import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Flex, Input, Text, FormLabel, VStack } from "@chakra-ui/react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import Redirect from "./Redirect";
import ShowAlert from "../Alert/ShowAlert";

const LoginForm = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [customErrorMessage, setCustomErrorMessage] = useState<string>("");

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const Router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(loginForm.email, loginForm.password);
      await new Promise<void>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            unsubscribe();
            resolve();
          } else {
            if (error && error.code === "auth/user-not-found") {
              setCustomErrorMessage("User not found. Please check your credentials.");
            } else if (error && error.code === "auth/wrong-password") {
              setCustomErrorMessage("Invalid password. Please try again.");
            } else {
              setCustomErrorMessage("Internal Server Error");
            }
            return;
          }
        });
      });
      setLoginForm({ email: "", password: "" });
      Router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomErrorMessage("");
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Flex
      width={["100vw", "100vw", "100vw", "50vw"]}
      padding="10vw"
      paddingTop={["0", "0", "0", "10vh"]}
      alignItems="center"
      justifyContent="center"
    >
      <form onSubmit={onSubmit}>
        <VStack alignItems="flex-start">
          <FormLabel color="white">Email address</FormLabel>
          <Input
            required
            name="email"
            placeholder="email"
            type="text"
            width={["75vw", "75vw", "75vw", "25vw"]}
            height="7.5vh"
            mb={2}
            onChange={onChange}
            bg="blue.800"
            border="blue.400"
          />
        </VStack>
        <VStack alignItems="flex-start">
          <FormLabel color="white">Password</FormLabel>
          <Input
            required
            name="password"
            placeholder="password"
            type="password"
            width={["75vw", "75vw", "75vw", "25vw"]}
            height="7.5vh"
            mb={2}
            onChange={onChange}
            bg="blue.800"
            border="blue.400"
          />
        </VStack>
        <Flex width="full" alignItems="center" justifyContent="center">
          <Button
            fontSize="md"
            variant="success"
            width={["30vw", "50vw", "50vw", "25vw"]}
            height={["50px", "70px", "50px", "50px"]}
            mt={5}
            mb={2}
            type="submit"
            isLoading={loading}
          >
            Log In
          </Button>
        </Flex>
        <Redirect view="login"></Redirect>
      </form>
      <ShowAlert
        type="error"
        title="Sorry!"
        message={customErrorMessage}
        isVisible={customErrorMessage ? true : false}
        onClose={() => setCustomErrorMessage("")}
      />
      )
    </Flex>
  );
};
export default LoginForm;
