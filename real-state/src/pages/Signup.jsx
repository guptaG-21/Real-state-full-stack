import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  //handles the changes happen to text fields
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  //handle the submit button things
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          className='border p-3 rounded-lg'
          type='text'
          placeholder='username'
          id='username'
          onChange={handleChange}
        />

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
          {loading ? "loading..." : "sign-up"}
        </button>
        <h3 className='text-center font-semibold '>OR</h3>
        <Oauth />        
      </form>
      <div className='flex p-2 gap-2'>
        <p className='font-semibold'>Already have an account? </p>
        <Link to={"/sign-in"}>
          <strong className='text-blue-600 underline'>sign-in</strong>
        </Link>
      </div>
      {error && <p className='text-red-600 mt-3'>{error}</p>}
    </div>
  );
};

export default Signup;
