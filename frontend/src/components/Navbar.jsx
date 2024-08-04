import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import { setItemClear } from '../redux/itemSlice'

import { IoMdMenu } from 'react-icons/io'
const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [heading, setHeading] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(setItemClear())
    dispatch({ type: 'auth/setLogout' })
    Cookies.remove('token')
    navigate('/')
  }
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  useEffect(() => {
    switch (location.pathname) {
      case '/view-items':
        setHeading('Items Pending')
        break
      case '/view-done':
        setHeading('Items Done')
        break
      case '/add-item':
        setHeading('Add Item')
        break
      case '/modify-item':
        setHeading('Update Item')
        break
      case '/delete-item':
        setHeading('Delete Item')
        break

      default:
        setHeading('Mern Todo')
        break
    }
  }, [location])

  if (location.pathname === '/') {
    return null
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-20 w-screen h-[70px] px-[5%] justify-between bg-white/10 backdrop-blur items-center max-w-screen">
        <div className="relative w-full flex flex-row items-center h-[70px] justify-between border-b border-slate-300 pb-1 pt-2">
          <h1 className="absolute text-xl xl:text-4xl sm:text-3xl font-bold max-w-fit mx-auto inset-x-0 text-center">
            {heading}
          </h1>

          <div className="hidden lg:flex flex-row justify-between gap-2 mt-2 items-end">
            <Link
              to="/view-items"
              className="p-1 text-md font-semibold hover:text-[#57ba46]"
            >
              View Pending
            </Link>
            <Link
              to="/view-done"
              className="p-1 text-md font-semibold hover:text-[#57ba46]"
            >
              View Done
            </Link>
            <Link
              to="/add-item"
              className="p-1 text-md font-semibold hover:text-[#57ba46]"
            >
              Add Item
            </Link>
          </div>

          <div className="hidden lg:flex  mt-2">
            <button
              onClick={handleLogout}
              className="p-1 text-md font-semibold hover:text-[#57ba46]"
            >
              Logout
            </button>
          </div>

          <div className="lg:hidden">
            <button
              id="dropdownButton"
              onClick={toggleMenu}
            >
              <IoMdMenu size="30px" />
            </button>

            <div
              id="dropdownMenu"
              className={`${
                isMenuOpen ? 'flex flex-col py-2 px-2' : 'hidden'
              } dropdown-menu`}
            >
              <Link
                to="/view-items"
                className="dropdown-link"
              >
                View Pending
              </Link>
              <Link
                to="/view-done"
                className="dropdown-link"
              >
                View Done
              </Link>
              <Link
                to="/add-item"
                className="dropdown-link"
              >
                Add Item
              </Link>
              <button
                onClick={handleLogout}
                className="dropdown-link w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
