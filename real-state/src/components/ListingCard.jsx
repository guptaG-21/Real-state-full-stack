import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBath, FaBed } from "react-icons/fa";
function ListingCard({ listing }) {
  return (
    <div className=' bg-white  w-full sm:w-[320px] overflow-hidden rounded-lg shadow-md sm:shadow-lg transition-shadow'>
      <Link to={`/listing/${listing._id}`}>
        <img
          className='h-[320px] sm:h-[220px] hover:scale-105 transition-scale duration-300 object-cover '
          src={listing.imageUrl[0]}
          alt='listing_cover'
        />
        <div className='flex flex-col p-3 gap-2 w-full'>
          <p className='truncate text-lg font-semibold '>{listing.name}</p>
          <div className=' flex gap-2 w-full items-center'>
            <FaMapMarkerAlt className='text-green-600 ' />
            <p className='text-sm truncate w-full'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>
          <p className='text-gray-500 font-semibold'>
            ₹{" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-IN")
              : listing.regularPrice.toLocaleString("en-IN")}
            {listing.type === "rent" ? " /month" : ""}
          </p>
          <div className='flex gap-10'>
            <div className='flex gap-1 items-center'>
              <FaBath className='text-green-700' />
              <p className='font-semibold'>{listing.bathrooms} baths</p>
            </div>

            <div className='flex gap-1 items-center'>
              <FaBed className='text-green-700' />
              <p className='font-semibold'>{listing.bedrooms} beds</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListingCard;
