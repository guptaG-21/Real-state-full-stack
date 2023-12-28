import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateStart,
  updateFailure,
  updateSuccessful,
  deleteFailure,
  deleteSuccessful,
  deleteStart,
  signOutFailure,
  signOutSuccessful,
  signOutStart,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { curruser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [listing, setListing] = useState([]);
  const [openListing, setOpenListing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  //for the picture uploading
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setFilePerc(progress);
        toast(`${progress} % uploaded photo`,{autoClose:500})
      },

      (error) => {
        setUploadError(true);
        toast.error("error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
          toast.info("profile uploaded,wait to reflect", {
            autoClose: 1500,
            theme: "colored",
          });
        });
      }
    );
  };
  //for updating the profile data,
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`api/user/update/${curruser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        toast.error("updating failure!", {
          theme: "colored",
          autoClose: 1000,
        });
        return;
      }
      dispatch(updateSuccessful(data));
      toast.success("updated Successfully!", {
        theme: "colored",
        autoClose: 1000,
      });
      setUpdateSuccess(true);
      console.log("yes");
    } catch (error) {
      dispatch(updateFailure(error.message));
      console.log(error);
    }
  };
  //handling the changes will happen to add in the formData ex- email,username
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //deleting the user
  const handleDelete = async () => {
    try {
      toast.success("updating failure!", {
        theme: "colored",
        autoClose: 1000,
      });
      dispatch(deleteStart());
      const deletedUser = await fetch(`api/user/delete/${curruser._id}`, {
        method: "DELETE",
      });
      const data = await deletedUser.json();
      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        toast.error("failed to delete!", { theme: "colored", autoClose: 1000 });
        return;
      } else {
        dispatch(deleteSuccessful(data));
        toast.success("User Deleted successfully!", { autoClose: 1000 });
      }
      localStorage.setItem("flashMessage", "User deleted successfully!");
      localStorage.setItem("flashMessageType", "success");
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  //for sign-out the user
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success == false) {
        dispatch(signOutFailure(data.message));
        toast.error("failed to SignOut!", {
          theme: "colored",
          autoClose: 1000,
        });
        return;
      }
      localStorage.setItem("flashMessage", "User Signed out successfully!");
      localStorage.setItem("flashMessageType", "success");
      dispatch(signOutSuccessful(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  //getting the listings to show on page
  const handleShowListings = async () => {
    try {
      setListingError(false);
      const res = await fetch(`/api/user/listings/${curruser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setListingError(data.message);
      }
      setListing(data);
      setOpenListing(true);
    } catch (error) {
      setListingError(error.message);
    }
  };
  //close open thing for listings
  const combinedClick = () => {
    if (!openListing) {
      handleShowListings();
    }
    setOpenListing(!openListing);
  };
  //deleting the listing
  const deleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      console.log(data);
      setListing((prev) => prev.filter((listing) => listing._id !== listingId));
      toast.info("listing has deleted!", { autoClose: 1000, theme: "colored" });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h2 className=' text-center font-semibold my-7 text-3xl '>Profile</h2>
      {/* <button onClick={notify}>delete</button> */}
      <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          accept='image/*'
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          className='w-24 object-cover cursor-pointer mt-2 rounded-full self-center'
          src={formData.avatar || curruser.avatar}
          alt='profile'
        />
        <input
          className='rounded-lg border border-blue-200  p-3'
          type='text'
          placeholder='username'
          id='username'
          defaultValue={curruser.username}
          onChange={handleChange}
        />
        <input
          className='rounded-lg border border-blue-200  p-3'
          type='text'
          placeholder='email'
          id='email'
          defaultValue={curruser.email}
          onChange={handleChange}
        />
        <input
          className='rounded-lg border border-blue-200  p-3'
          type='password'
          placeholder='password'
          id='password'
          defaultValue={curruser.password}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='rounded-lg p-3 text-white font-semibold uppercase bg-blue-500 hover:opacity-90 disabled:opacity-80 text-md '
        >
          {loading ? "Loading..." : "update"}
        </button>
        <Link
          className='bg-green-600 p-3 rounded-lg text-center uppercase text-white font-semibold hover:opacity-80 text-md'
          to={"/create-Listing"}
        >
          create listing
        </Link>
      </form>
      <div className='flex justify-between mt-5 '>
        <button
          onClick={handleDelete}
          className='text-red-600 font-semibold cursor-pointer border border-gray-100 border-b-red-600 uppercase'
        >
          Delete Account
        </button>

        <span
          onClick={handleSignOut}
          className='text-red-600 font-semibold cursor-pointer border border-gray-100 border-b-red-600 uppercase'
        >
          Sign-out
        </span>
      </div>
      <div className='flex justify-center '>
        <button
          onClick={combinedClick}
          className=' w-[120px] font-semibold text-blue-700 mt-2 border-gray-100 border border-b-blue-700 uppercase'
        >
          {!openListing ? "show Listing" : "close listing"}
        </button>
      </div>
      {openListing
        ? listing &&
          listing.length > 0 && (
            <div className='flex flex-col gap-3'>
              <h1 className='text-center mt-3 text-2xl font-semibold text-blue-600 underline'>
                Your Listings
              </h1>
              {listing.map((listing) => (
                <div
                  key={listing._id}
                  className='flex gap-4 p-3 shadow-2xl rounded-lg justify-between border-gray-700  '
                >
                  <Link className='' to={`/listing/${listing._id}`}>
                    <div className='flex items-center gap-4'>
                      <img
                        className='w-20 rounded-lg'
                        src={listing.imageUrl[0]}
                        alt=''
                      />
                      <p className='text-center hover:underline truncate font-bold '>
                        {listing.name}
                      </p>
                    </div>
                  </Link>

                  <div className='flex flex-col justify-center '>
                    <button
                      onClick={() => deleteListing(listing._id)}
                      className='text-red-600 uppercase font-semibold hover:opacity-80 '
                    >
                      delete
                    </button>
                    <Link to={`/update-Listing/${listing._id}`}>
                      <button className='text-green-600 uppercase font-semibold hover:opacity-80'>
                        edit
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        : ""}
      {listingError ? toast.error("Error while fetching the listings",{autoClose:1200,theme:"colored"}):"" }
      <ToastContainer />
    </div>
  );
};

export default Profile;
