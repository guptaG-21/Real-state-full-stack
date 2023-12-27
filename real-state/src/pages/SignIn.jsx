import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInFailure, signInSuccess } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "../components/Oauth";
const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          className='border p-3 rounded-lg'
          type='email'
          placeholder='email'
          id='email'
          onChange={handleChange}
        />

        <input
          className='border p-3 rounded-lg'
          type='password'
          placeholder='password'
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-blue-500 rounded-lg p-2 font-bold text-white hover:opacity-90 disabled:opacity-70'
        >
          {loading ? "loading..." : "sign-in"}
        </button>
        <h3 className='text-center font-semibold '>OR</h3>

        <Oauth />
      </form>
      <div className='flex p-2 gap-2'>
        <p className='font-semibold'>Don't have an account? </p>
        <Link to={"/sign-up"}>
          <strong className='text-blue-600 underline'>sign-up</strong>
        </Link>
      </div>
      {error && <p className='text-red-600 mt-3'>{error}</p>}
    </div>
  );
};

export default SignIn;
