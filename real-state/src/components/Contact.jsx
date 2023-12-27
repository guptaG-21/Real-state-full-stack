import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log("error while fetching");
      }
    };
    fetchUser();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-3'>
          <p>
            contact to <strong>{landlord.username}</strong> for{" "}
            <strong>{listing.name.toLowerCase()}</strong>
          </p>
          <textarea
            placeholder='Enter your message'
            name='message'
            id='message'
            rows='2'
            onChange={handleChange}
            className='w-full rounded-lg border border-gray-400 p-3'
          ></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="uppercase p-3 bg-blue-600 rounded-lg text-center font-semibold text-white hover:opacity-90">
            Send message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
