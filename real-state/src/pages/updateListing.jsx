import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useParams,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const UpdateListing = () => {
  const [file, setFile] = useState([]);
  const [formData, setFormData] = useState({
    imageUrl: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 1,
    discountPrice: 0,
    bathrooms: 0,
    bedrooms: 0,
    type: "",
    parking: false,
    furnished: false,
    offer: false,
  });
  const { curruser } = useSelector((state) => state.user);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  console.log(formData);

  useEffect(() => {
    const update = async () => {
      const res = await fetch(`/api/listing/get/${params.listingID}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      setFormData(data);
    };
    update();
  }, []);

  const handleImageSubmit = () => {
    if (file.length > 0 && file.length + formData.imageUrl.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < file.length; i++) {
        promises.push(storeFile(file[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrl: formData.imageUrl.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (max 2mb per image)!");
          setUploading(false);
        });
    } else {
      setImageUploadError("Max 6 images can be uploaded!");
      setUploading(false);
    }
  };
  const storeFile = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
          toast.error("Image upload failed (max 2mb per image)!",{autoClose:2000,theme:"colored"})
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
          toast.info("file uploaded,wait to reflect",{autoClose:1500,theme:"colored"})
        }
      );
    });
  };
  const handleClickDelete = (index) => {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index),
    });
    toast.success("Deleted!",{autoClose:500,theme:"colored"})
  };

  const handleChange = (e) => {
    if (e.target.id === "rent" || e.target.id === "sale") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "furnished" ||
      e.target.id === "offer" ||
      e.target.id === "parking"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrl.length < 1) {
        setError("Atleast one image should be uploaded!");
      }
      if (+formData.regularPrice < +formData.discountedPrice) {
        setError("discounted price must be less than regular price!");
      }
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: curruser._id }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      }
      setLoading(false);
      localStorage.setItem("flashMessage","listing updated Successfully!");
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-5 max-w-4xl mx-auto'>
      <h1 className='text-3xl text-center text-black font-semibold my-7  bg-blue-300 p-2 rounded-lg'>
        Update a Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            id='name'
            className='border p-3 rounded-lg'
            minLength={10}
            maxLength={62}
            required
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            type='text'
            placeholder='Description'
            id='description'
            className='border p-3 rounded-lg'
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='Address'
            id='address'
            className='border p-3 rounded-lg'
            required
            value={formData.address}
            onChange={handleChange}
          />

          <div className='flex flex-wrap gap-6 '>
            <div className='flex gap-2 '>
              <input
                className='w-5'
                type='checkbox'
                id='sale'
                checked={formData.type === "sale"}
                onChange={handleChange}
              />
              <span className='font-semibold'>Sell</span>
            </div>
            <div className='flex gap-2 '>
              <input
                className='w-5'
                type='checkbox'
                id='rent'
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              <span className='font-semibold'>Rent</span>
            </div>
            <div className='flex gap-2 '>
              <input
                className='w-5'
                type='checkbox'
                id='parking'
                checked={formData.parking}
                onChange={handleChange}
              />
              <span className='font-semibold'>Parking Spot</span>
            </div>
            <div className='flex gap-2 '>
              <input
                className='w-5'
                type='checkbox'
                id='furnished'
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span className='font-semibold'>Furnished</span>
            </div>
            <div className='flex gap-2 '>
              <input
                className='w-5'
                type='checkbox'
                id='offer'
                checked={formData.offer}
                onChange={handleChange}
              />
              <span className='font-semibold'>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6 '>
            <div className='flex items-center gap-3'>
              <input
                type='number'
                id='bedrooms'
                min={1}
                max={10}
                value={formData.bedrooms}
                className='p-3 rounded-lg border '
                checked={formData.bedrooms}
                onChange={handleChange}
              />
              <p className='font-semibold'>Beds</p>
            </div>
            <div className='flex items-center gap-3'>
              <input
                type='number'
                id='bathrooms'
                min={1}
                max={10}
                value={formData.bathrooms}
                className='p-3 rounded-lg border '
                checked={formData.bathrooms}
                onChange={handleChange}
              />
              <p className='font-semibold'>Baths</p>
            </div>
            <div className='flex items-center gap-3'>
              <input
                type='number'
                id='regularPrice'
                value={formData.regularPrice}
                className='p-3 rounded-lg border '
                checked={formData.regularPrice}
                onChange={handleChange}
              />
              <div className='flex flex-col items-center'>
                <p className='font-semibold'>Price</p>
                <span className='font-semibold'>(INR/month)</span>
              </div>
            </div>
            {formData.offer ? (
              <div className='flex items-center gap-3'>
                <input
                  type='number'
                  value={formData.discountPrice}
                  id='discountPrice'
                  className='p-3 rounded-lg border '
                  onChange={handleChange}
                />

                <div className='flex flex-col items-center'>
                  <p className='font-semibold'>Discounted Price</p>
                  <span className='font-semibold'>(INR/mont)</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-2'>
          <p>
            <strong>Image</strong>: The image will be the cover (max 6 img)
          </p>
          <div className='flex gap-2'>
            <input
              type='file'
              id='images'
              className=' border border-gray-400 p-2 rounded-lg w-full'
              accept='image/*'
              multiple
              onChange={(e) => setFile(e.target.files)}
            />
            <button
              type='button'
              onClick={handleImageSubmit}
              className='bg-green-600 text-white rounded-lg p-2 uppercase font-semibold hover:shadow-xl disabled:opacity-80'
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>

          {formData.imageUrl.length > 0 &&
            formData.imageUrl.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border border-gray-400 rounded-lg items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-30 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleClickDelete(index)}
                  className='p-3 text-red-600 rounded-lg uppercase hover:opacity-75 font-semibold'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            onClick={handleSubmit}
            className='p-3 bg-blue-500 text-white uppercase font-semibold rounded-lg hover:shadow-xl disabled:opacity-80 '
          >
            {loading ? "Updating.." : "update listing"}
          </button>
          <p className='text-red-600'>{error}</p>
        </div>
      </form>
      <ToastContainer />
    </main>
  );
};

export default UpdateListing;
