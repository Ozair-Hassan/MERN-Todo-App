/* eslint-disable no-unused-vars */
import React from 'react'
import Navbar from '../../components/Navbar'
import ItemForm from '../../components/ItemForm'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

const initialValues = {
  title: '',
  description: '',
  priority: '',
  category: '',
  visibility: 'Private',
  isDone: false,
}

// Notifications
// const notify = (state, message = '') => {
//   if (state === true) {
//     return toast.success('Success, Item Added', {
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

const AddItem = () => {
  const navigate = useNavigate()

  const addItem = async (values, onSubmitProps) => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      await axios.post('/api/item/add', values, config)
      // notify(true)
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

      // notify(false, errorMessage)
    }
  }

  return (
    <>
      <Navbar />
      <ItemForm
        initialValues={initialValues}
        onSubmit={addItem}
      />
    </>
  )
}

export default AddItem
