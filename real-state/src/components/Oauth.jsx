import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //for handling the google auth
  const handleGoogleSubmit = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = new getAuth(app);
      const res = await signInWithPopup(auth, provider);
      console.log(res);
      const result = await fetch("/api/auth/google", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: res.user.displayName,
          email: res.user.email,
          photo: res.user.photoURL,
        }),
      });
      const data = await result.json();
      console.log(data);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("error with sign-in google", error);
    }
  };
  return (
    <button
      onClick={handleGoogleSubmit}
      type='button'
      className='bg-red-500 font-semibold text-white p-2 rounded-lg hover:opacity-90'
    >
      Continue with Google
    </button>
  );
};

export default Oauth;
