///
/// @ TODO Address Bug in FullName error validation
///

import { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { logo } from '../../assets'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLogin } from '../../redux/authSlice'
import Cookies from 'js-cookie'
import axios from 'axios'
import { toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const registerSchema = yup.object().shape({
  fullName: yup.string().required('Required'),
  email: yup.string().email('Invalid Email').required('Required'),
  password: yup.string().required('Required'),
})

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid Email').required('Required'),
  password: yup.string().required('Required'),
})

const initalValuesRegister = {
  fullName: '',
  email: '',
  password: '',
}

const initalValuesLogin = {
  email: '',
  password: '',
}

const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [pageType, setPageType] = useState('login')

  // Notifications
  const notifyRegister = (state, message = '') => {
    if (state === true) {
      return toast.success('Success, Login to continue', {
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

  const notifyLogin = (state, message = '') => {
    if (state === true) {
      return toast.success('Login Sucessfull', {
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

  // Function to login a user
  const login = async (values, onSubmitProps) => {
    try {
      const loginResponse = await axios.post('/api/auth/login', values)
      const token = loginResponse.data.token

      Cookies.set('token', token, { expires: 7 })
      dispatch(setLogin({ token: token }))

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const userResponse = await axios.get('/api/auth/verifyToken', config)
      const user = userResponse.data

      dispatch(setLogin({ user: user, token: token }))
      notifyLogin(true)
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

      notifyLogin(false, errorMessage)
    } finally {
      onSubmitProps.resetForm()
    }
  }
  // Function to register a new user
  const register = async (values, onSubmitProps) => {
    try {
      await axios.post('/api/auth/register', values)

      notifyRegister(true)
      setPageType('login')
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

      notifyRegister(false, errorMessage)
    }
  }

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps)
    if (isRegister) await register(values, onSubmitProps)
  }
  const isLogin = pageType === 'login'
  const isRegister = pageType === 'register'
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initalValuesLogin : initalValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        resetForm,
        errors,
      }) => (
        <>
          <div className="flex items-center justify-center h-screen">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center border py-4 xl:w-[40%] lg:w-[60%] mx-auto md:w-[80%] xs:w-[80%]  "
            >
              <img
                src={logo}
                alt="To do Tracker"
                className="max-w-[60%] h-auto xs:w-[75%] -mt-2"
              />
              <div className="w-full max-w-[75%] min-h-[200px]  flex flex-col justify-evenly py-2 ">
                {/*  Email  */}
                <div className="flex flex-col md:flex-row w-full md:justify-between md:items-center mb-4 px-4">
                  <label
                    htmlFor="email"
                    className="mb-2 md:mb-0 font-semibold"
                  >
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={
                      touched.email && errors.email
                        ? errors.email
                        : 'email@example.com'
                    }
                    className={`border rounded-lg px-2 py-1 w-full md:w-3/4 ${
                      touched.email && errors.email
                        ? 'border-red-500 placeholder-error'
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                {isRegister && (
                  <>
                    {/*  Full Name  */}
                    <div className="flex flex-col md:flex-row w-full md:justify-between md:items-center mb-4 px-4">
                      <label
                        htmlFor="fullName"
                        className="mb-2 md:mb-0 font-semibold"
                      >
                        Full Name:
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={values.fullName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={
                          touched.fullName && errors.fullName
                            ? errors.fullName
                            : 'John Doe'
                        }
                        className={`border rounded-lg px-2 py-1 w-full md:w-3/4 ${
                          touched.fullName && errors.fullName
                            ? 'border-red-500 placeholder-error'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </>
                )}

                {/*  Password  */}
                <div className="flex flex-col md:flex-row w-full md:justify-between md:items-center mb-4 px-4">
                  <label
                    htmlFor="password"
                    className="mb-2 md:mb-0 font-semibold"
                  >
                    Password:
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={
                      touched.password && errors.password
                        ? errors.password
                        : '123456'
                    }
                    className={`border rounded-lg px-2 py-1 w-full md:w-3/4 ${
                      touched.password && errors.password
                        ? 'border-red-500 placeholder-error'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
              {/*  Buttons  */}
              <div className="w-full px-4  flex justify-center items-center">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-[#8f8f8e] hover:bg-[#57ba46] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                >
                  {isLogin ? 'LOGIN' : 'REGISTER'}
                </button>
              </div>
              <div className="w-full px-4 mt-2 flex justify-center items-center">
                <span
                  className="gradient-text-subtitle md:text-xl  xs:text-sm text-center xs:mt-2 font-semibold cursor-pointer "
                  onClick={() => {
                    resetForm()

                    setPageType(isLogin ? 'register' : 'login')
                  }}
                >
                  {isLogin
                    ? 'Dont have an account? Sign Up here.'
                    : 'Already have an account? Login here.'}
                </span>
              </div>
            </form>
          </div>
        </>
      )}
    </Formik>
  )
}

export default Form
