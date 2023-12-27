import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom';

const ProtectUser = () => {
    const {curruser} = useSelector((state)=>state.user);
  return (curruser? <Outlet /> : <Navigate to={"/sign-in"} />
  )
}

export default ProtectUser