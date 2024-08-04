import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { logo } from '../assets/index'
const PageNotFound = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const token = Cookies.get('token')

    if (token) {
      let timeout = setTimeout(() => {
        navigate('/view-items')
      }, 2000)
      return () => {
        clearTimeout(timeout)
      }
    } else {
      let timeout = setTimeout(() => {
        navigate('/')
      }, 2000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [navigate])
  return (
    <>
      <div></div>
      <div className="flex flex-col justify-center items-center mx-auto my-auto fixed top-0 left-0 w-screen z-50 bg-white h-screen overflow-hidden">
        <img
          src={logo}
          alt=""
          className="mt-5 md:-mt-20 ml-2 xl:w-[32%] h-auto xs:w-[80%] md:w-[65%]"
        />

        <h1 className="flex flex-col justify-center items-center text-center  gradient-text font-extrabold md:py-2 py-5  mx-5 mt-5 md:mt-0 md:flex-row md:text-3xl sm:text-2xl xs:text-2xl">
          404 - Page Not Found
        </h1>
        <p className="flex flex-col justify-center items-center text-center  font-extrabold text-red-600 py-5 md:py-2 mx-5 mt-5 md:mt-0 md:flex-row md:text-xl sm:text-kg xs:text-lg">
          Sorry, the page you are looking for does not exist.
        </p>

        <h1 className="flex flex-col justify-center items-center text-center   font-extrabold py-5 md:py-2 mx-5 mt-5 md:mt-0 md:flex-row md:text-4xl sm:text-3xl xs:text-3xl">
          You are being redirected back
          <span className="animate-dots inline-flex justify-start items-start w-[36px] h-[40px]"></span>
        </h1>
      </div>
    </>
  )
}

export default PageNotFound
