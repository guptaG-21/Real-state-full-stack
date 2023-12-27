import React, { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { curruser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParam = new URLSearchParams(window.location.search);
    urlParam.set("searchTerm", searchTerm);
    const searchQuery = urlParam.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const getSearchTermFromUrl = urlParam.get('searchTerm');
    if (getSearchTermFromUrl) {
      setSearchTerm(getSearchTermFromUrl);
    }
  }, [location.search]);
  console.log(searchTerm);
  return (
    <header className='bg-blue-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4 flex-wrap'>
        <Link to='/'>
          <h1 className='font-bold flex flex-wrap text-xl'>
            <span className='text-slate-500'>REAL</span>
            <span className='text-red-600'>State</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded p-2 flex  items-center w-25 sm:w-60'
        >
          <input
            className='bg-transparent focus:outline-none '
            type='text'
            placeholder='search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaMagnifyingGlass className='text-slate-500 ' />
          </button>
        </form>
        <ul className='flex gao-0 sm:gap-6'>
          <Link to='/'>
            <li className='hidden sm:block text-slate-700 font-bold hover:cursor-pointer hover:underline hover:scale-110 duration-200'>
              Home
            </li>
          </Link>

          <Link to='/about'>
            <li className='hidden sm:block text-slate-700 font-bold hover:cursor-pointer hover:underline hover:scale-110 duration-200'>
              About
            </li>
          </Link>

          <Link to='/profile'>
            {curruser ? (
              <img
                className='h-7 w-7 rounded-lg object-cover'
                src={curruser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-slate-700 font-bold hover:cursor-pointer hover:underline hover:scale-110 duration-200'>
                Sign-In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
