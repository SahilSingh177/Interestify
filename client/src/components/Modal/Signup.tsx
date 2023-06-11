import React, { useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
// import { ModalView } from "../../../atoms/authModalAtom";
// import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
// import { auth } from '../../../../firebase/clientApp';



const Signup= () => {
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

//   const [
//     createUserWithEmailAndPassword,
//     user,
//     loading,
//     error,
//   ] = useCreateUserWithEmailAndPassword(auth);

//   const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
    
//     // if(signupForm.password!=signupForm.confirmPassword){
//     //   Show Error
//     //   Have to Implement 
//     //   return;
//     // }
//     //Handle error when the user already exists
//     //Implement sign in with google
//     //Firebase Logic

//     createUserWithEmailAndPassword(signupForm.email,signupForm.password);

//   };

  const onChange =(event:React.ChangeEvent<HTMLInputElement>) =>{
    setSignupForm(prev=>({
      ...prev,
      [event.target.name]:event.target.value,
    }))
  }

  return (
    <form >
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
      <Input
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        onChange={onChange}
      />
      <Button width="100%" height="36px" mt={2} mb={2} type="submit">
        Sign Up
      </Button>
      {/* //Already here . Click to Signin
      //Implement with Recoil */}
    </form>
  );
};
export default Signup;
