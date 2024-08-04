import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { logo } from '../assets/index'
const NoItemsFound = () => {
  return (
    <>
      <div></div>
      <div className="flex flex-col justify-center items-center mx-auto my-auto h-96 w-auto  overflow-hidden">
        <img
          src={logo}
          alt=""
          className="mt-5 md:-mt-20 ml-2 xl:w-[32%] h-auto xs:w-[80%] md:w-[65%]"
        />

        <h1 className="flex flex-col justify-center items-center text-center  text-[#8f8f8e] font-extrabold md:py-2 py-5  mx-5 mt-5 md:mt-0 md:flex-row md:text-3xl sm:text-2xl xs:text-2xl">
          Sorry no items match your criteria
        </h1>
      </div>
    </>
  )
}

export default NoItemsFound
