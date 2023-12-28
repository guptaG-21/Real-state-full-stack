import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

function Search() {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    parking: false,
    furnished: false,
    offer: false,
    type: "all",
    order: "desc",
    sort: "created_at",
  });
  console.log(listing);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const offerUrl = urlParams.get("offer");
    const furnishedUrl = urlParams.get("furnished");
    const orderUrl = urlParams.get("order");
    const sortUrl = urlParams.get("sort");
    const parkingUrl = urlParams.get("parking");
    const typeUrl = urlParams.get("type");

    if (
      searchTermUrl ||
      offerUrl ||
      furnishedUrl ||
      orderUrl ||
      sortUrl ||
      parkingUrl ||
      typeUrl
    ) {
      setSearchData({
        searchTerm: searchTermUrl || "",
        offer: offerUrl === "true" ? true : false,
        sort: sortUrl || "created_at",
        order: orderUrl || "desc",
        parking: parkingUrl === "true" ? true : false,
        type: typeUrl || "all",
        furnished: furnishedUrl === "true" ? true : false,
      });
    }

    const fetchData = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const listingData = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await listingData.json();
      if (data.length > 8) {
        setShowMore(true);
      } else{
        setShowMore(false);
      }
      setListing(data);
      setLoading(false);
    };
    fetchData();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSearchData({ ...searchData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSearchData({ ...searchData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSearchData({
        ...searchData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSearchData({ ...searchData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchData.searchTerm);
    urlParams.set("type", searchData.type);
    urlParams.set("offer", searchData.offer);
    urlParams.set("furnished", searchData.furnished);
    urlParams.set("order", searchData.order);
    urlParams.set("sort", searchData.sort);
    urlParams.set("parking", searchData.parking);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMoreClick = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing([...listing, ...data]);
  };
  console.log(showMore);
  return (
    <div className='flex flex-col sm:flex-row gap-4 p-2'>
      <div className='md:min-h-screen border-b-2 p-7 md:border-r-2  '>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Search: </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='search'
              className='w-full p-3 rounded-lg border'
              value={searchData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex gap-2'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                className='w-5 '
                type='checkbox'
                id='all'
                checked={searchData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type='checkbox'
                id='rent'
                checked={searchData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type='checkbox'
                id='sale'
                checked={searchData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type='checkbox'
                id='offer'
                checked={searchData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex gap-2'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                className='w-5 '
                type='checkbox'
                id='parking'
                checked={searchData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5 '
                type='checkbox'
                id='furnished'
                checked={searchData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className='p-3 rounded-lg'
              name=''
              id='sort_order'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='text-white bg-blue-500 rounded-lg p-3 uppercase font-semibold hover:opacity-95 text-md'>
            search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-2xl uppercase font-semibold mt-5'>
          listing results :
        </h1>
        <div className='flex flex-wrap gap-6 mt-5'>
          {!loading && listing.length === 0 && (
            <p className='text-xl font-semibold'>Listing not found</p>
          )}
          {loading && (
            <p className='text-xl text-center font-semibold mt-10'>Loading..</p>
          )}
          {!loading &&
            listing &&
            listing.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              className='text-green-600 hover:underline'
              onClick={handleShowMoreClick}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
