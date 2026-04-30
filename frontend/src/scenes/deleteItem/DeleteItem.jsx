/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import Loader from '../../components/Loader'
import { setCurrentIdClear } from '../../redux/itemSlice'

const DeleteItem = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentItemId = useSelector((state) => state.item.currentItemId)
  const viewedItems = useSelector((state) => state.item.viewedItems)
  const [currentItem, setCurrentItem] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState({})

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  const isTitleMatch = userInput.trim() === currentItem?.title.trim()

  // Notifications
  // const notify = (state, message = '') => {
  //   if (state === true) {
  //     return toast.success('Success, Item Deleted', {
  //       position: 'bottom-center',
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: 'light',
  //       transition: Slide,
  //     })
  //   } else {
  //     let errorMessage = message ? `${message}` : 'Error: Try Again'
  //     toast.error(errorMessage, {
  //       position: 'bottom-center',
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: 'light',
  //       transition: Slide,
  //     })
  //   }
  // }

  useEffect(() => {
    const findCurrentItem = () => {
      if (viewedItems && currentItemId) {
        const matchedItem = viewedItems.find(
          (item) => item._id === currentItemId,
        )
        if (matchedItem) {
          setCurrentItem(matchedItem)
        } else {
          console.error('Item with ID not found:', currentItemId)
        }
      } else {
        console.error('viewedItems is null or undefined')
      }
    }

    if (currentItemId) {
      const token = Cookies.get('token')
      if (token) {
        const axiosConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        setConfig(axiosConfig)
        setLoading(false)
      } else {
        console.error('No token found')
      }
      findCurrentItem()
      setLoading(false)
    }
  }, [currentItemId, viewedItems])

  if (loading) {
    return (
      <>
        <Loader />
      </>
    )
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/item/delete/${currentItemId}`, config)
      dispatch(setCurrentIdClear())
      // notify(true)
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

      // notify(false, errorMessage)
    }
  }

  const handleCancel = () => {
    navigate('/view-items')
  }

  return (
    <div className="flex flex-col justify-center items-center mx-auto h-screen">
      {currentItem ? (
        <>
          <h2 className="text-xl font-bold mb-2 capitalize">
            Title: {currentItem.title}
          </h2>
          <span className="text-center">
            Please type the exact title,{' '}
            <span className="font-semibold">{currentItem.title}</span>, in the
            field below to confirm deletion of the selected item.
          </span>
          <input
            className="mt-2 border rounded border-black px-2 py-1"
            type="text"
            placeholder="Enter title"
            value={userInput}
            onChange={handleInputChange}
          />
          <div className="flex flex-row items-center mt-5 justify-center">
            <button
              onClick={handleDelete}
              className={`py-2 px-4 rounded-xl mr-5 ${
                isTitleMatch
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
              disabled={!isTitleMatch}
            >
              Delete
            </button>
            <button
              onClick={handleCancel}
              className="bg-green-400 text-white py-2 px-4 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p>No item selected or item not found.</p>
      )}
    </div>
  )
}

export default DeleteItem
