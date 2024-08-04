import React, { useState } from 'react'
import { setCurrentItemId } from '../redux/itemSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { CiEdit } from 'react-icons/ci'
import { FaTrashCan } from 'react-icons/fa6'
import { BiRedo } from 'react-icons/bi'
import Cookies from 'js-cookie'
import axios from 'axios'
import { toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ListItem = ({ item }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const User = useSelector((state) => state.auth.user)

  // Notifications
  const notify = (state, message = '') => {
    if (state === true) {
      let successMessage = message ? `${message}` : 'Error: Try Again'
      toast.success(successMessage, {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide,
      })
    } else {
      let errorMessage = message ? `${message}` : 'Error: Try Again'
      toast.error(errorMessage, {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide,
      })
    }
  }
  const handleModifyClick = (itemId) => {
    dispatch(setCurrentItemId(itemId))
    navigate('/modify-item')
  }
  const handleDoneClick = async (itemId) => {
    try {
      const token = Cookies.get('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const values = {
        isDone: 'true',
      }

      await axios.put(`/api/item/modify/${itemId}`, values, config)
      let successMessage = 'Item Marked Completed'
      notify(true, successMessage)
      navigate('/view-done')
    } catch (error) {
      let errorMessage = 'An error occurred'

      if (
        error.response &&
        error.response.data &&
        error.response.data.errors &&
        error.response.data.errors.length > 0
      ) {
        errorMessage = error.response.data.errors[0].msg
      } else if (error.message) {
        errorMessage = error.message
      }

      notify(false, errorMessage)
    }
  }
  const handleUnDoClick = async (itemId) => {
    try {
      const token = Cookies.get('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const values = {
        isDone: 'false',
      }

      await axios.put(`/api/item/modify/${itemId}`, values, config)
      let successMessage = 'Item Marked Incomplete'
      notify(true, successMessage)
      navigate('/view-items')
    } catch (error) {
      let errorMessage = 'An error occurred'

      if (
        error.response &&
        error.response.data &&
        error.response.data.errors &&
        error.response.data.errors.length > 0
      ) {
        errorMessage = error.response.data.errors[0].msg
      } else if (error.message) {
        errorMessage = error.message
      }

      notify(false, errorMessage)
    }
  }

  const handleDeleteClick = (itemId) => {
    dispatch(setCurrentItemId(itemId))
    navigate('/delete-item')
  }

  return (
    <div className="flex flex-row justify-between bg-gray-300 shadow-md rounded p-8">
      <div className="flex flex-col py-1 overflow-x-hidden [width:calc(100%-24px)]">
        <h2 className="text-xl font-bold mb-2 capitalize">{item.title}</h2>
        <p className="pt-1">
          <strong>Description:</strong> {item.description}
        </p>
        <p className="pt-1">
          <strong>Priority:</strong>{' '}
          {item.priority == 1 ? 'High' : item.priority == 2 ? 'Medium' : 'Low'}
        </p>
        <p className="pt-1">
          <strong>Category:</strong> {item.category}
        </p>
        <p className="pt-1">
          <strong>Visibility:</strong> {item.visibility}
        </p>
        {item.userId._id === User._id ? (
          <></>
        ) : (
          <p className="pt-1">
            <strong>Added By:</strong> {item.userId.fullName}
          </p>
        )}
      </div>
      <div className="flex flex-col justify-between w-[24px] pt-2 ml-4  ">
        {item.userId._id === User._id ? (
          <div className="flex flex-col justify-between h-full">
            {item.isDone ? (
              <button
                className="  mb-10 "
                onClick={() => handleUnDoClick(item._id)}
              >
                <BiRedo
                  className="hover:text-red-600 text-gray-500 "
                  size="24px"
                />
              </button>
            ) : (
              <>
                <button
                  className=" mt-auto mb-10 "
                  onClick={() => handleDoneClick(item._id)}
                >
                  <IoCheckmarkDoneSharp
                    className="hover:text-[#57ba46] text-gray-500 "
                    size="24px"
                  />
                </button>
                <button
                  className=" mt-auto mb-10"
                  onClick={() => handleModifyClick(item._id)}
                >
                  <CiEdit
                    className="text-black hover:text-yellow-600 "
                    size="24px"
                  />
                </button>
              </>
            )}

            <button
              className=" mt-auto mr-2 "
              onClick={() => handleDeleteClick(item._id)}
            >
              <FaTrashCan
                className="text-black hover:text-red-600 "
                size="24px"
              />
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default ListItem
