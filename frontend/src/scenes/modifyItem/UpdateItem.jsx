import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { setSingleItem, setCurrentIdClear } from '../../redux/itemSlice'
import ItemForm from '../../components/ItemForm'
import Loader from '../../components/Loader'
import { toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UpdateItem = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentItemId = useSelector((state) => state.item.currentItemId)
  const singleItem = useSelector((state) => state.item.singleItem)
  const initialValues = singleItem
    ? {
        title: singleItem.title,
        description: singleItem.description,
        priority: singleItem.priority,
        category: singleItem.category,
        visibility: singleItem.visibility,
      }
    : {
        title: '',
        description: '',
        priority: '',
        category: '',
        visibility: 'Private',
      }
  const [loading, setLoading] = useState(true)

  // Notifications
  const notify = (state, message = '') => {
    if (state === true) {
      return toast.success('Success, Item Modified', {
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

  useEffect(() => {
    if (currentItemId) {
      const verifyToken = async () => {
        const token = Cookies.get('token')
        if (token) {
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }

            const response = await axios.get(
              `/api/item/fetch/${currentItemId}`,
              config
            )
            const item = response.data
            dispatch(setSingleItem({ item }))
            dispatch(setCurrentIdClear())
          } catch (error) {
            console.log(error)
          }
        }
        setLoading(false)
      }

      verifyToken()
    }
  }, [currentItemId])

  if (loading) {
    return (
      <>
        <Loader />
      </>
    )
  }

  const modifyItem = async (values, onSubmitProps) => {
    try {
      const token = Cookies.get('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.put(`/api/item/modify/${singleItem._id}`, values, config)
      notify(true)
      navigate('/view-items')
      onSubmitProps.resetForm()
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
  return (
    <>
      <ItemForm
        initialValues={initialValues}
        onSubmit={modifyItem}
      />
    </>
  )
}

export default UpdateItem
