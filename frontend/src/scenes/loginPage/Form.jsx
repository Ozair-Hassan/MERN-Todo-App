/* eslint-disable no-unused-vars */
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

const DEMO_EMAIL = 'test123@test.com'
const DEMO_PASSWORD = '123456789'

const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [pageType, setPageType] = useState('login')
  const [isDemoMode, setIsDemoMode] = useState(false)

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
      setIsDemoMode(false)
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
        setValues,
      }) => {
        const handleDemoLogin = async () => {
          console.log('firing demo login with:', DEMO_EMAIL, DEMO_PASSWORD)
          setIsDemoMode(true)
          await login(
            { email: DEMO_EMAIL, password: DEMO_PASSWORD },
            { resetForm: () => {} },
          )
        }

        return (
          <>
            <div className="flex items-center justify-center h-screen">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center border py-4 xl:w-[40%] lg:w-[60%] mx-auto md:w-[80%] xs:w-[80%]"
              >
                <img
                  src={logo}
                  alt="To do Tracker"
                  className="max-w-[25%] h-auto xs:w-[75%] -mt-2"
                />
                <div className="w-full max-w-[75%] min-h-[200px] flex flex-col justify-evenly py-2">
                  {/* Email */}
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
                      disabled={isDemoMode}
                      placeholder={
                        touched.email && errors.email
                          ? errors.email
                          : 'email@example.com'
                      }
                      className={`border rounded-lg px-2 py-1 w-full md:w-3/4 disabled:opacity-50 disabled:cursor-not-allowed ${
                        touched.email && errors.email
                          ? 'border-red-500 placeholder-error'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {isRegister && (
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
                        disabled={isDemoMode}
                        placeholder={
                          touched.fullName && errors.fullName
                            ? errors.fullName
                            : 'John Doe'
                        }
                        className={`border rounded-lg px-2 py-1 w-full md:w-3/4 disabled:opacity-50 disabled:cursor-not-allowed ${
                          touched.fullName && errors.fullName
                            ? 'border-red-500 placeholder-error'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                  )}

                  {/* Password */}
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
                      disabled={isDemoMode}
                      placeholder={
                        touched.password && errors.password
                          ? errors.password
                          : '123456'
                      }
                      className={`border rounded-lg px-2 py-1 w-full md:w-3/4 disabled:opacity-50 disabled:cursor-not-allowed ${
                        touched.password && errors.password
                          ? 'border-red-500 placeholder-error'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="w-full px-4 flex justify-center items-center">
                  <button
                    type="submit"
                    disabled={isDemoMode}
                    className="w-full md:w-auto bg-[#8f8f8e] hover:bg-[#57ba46] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLogin ? 'LOGIN' : 'REGISTER'}
                  </button>
                </div>

                {/* Demo login — only shown on login page */}
                {isLogin && (
                  <div className="w-full px-4 mt-3 flex justify-center items-center gap-2 text-sm text-gray-500">
                    <span>Just browsing?</span>
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={isDemoMode}
                      className="font-semibold underline underline-offset-2 hover:text-[#57ba46] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                    >
                      👤 Try the demo
                    </button>
                  </div>
                )}

                <div className="w-full px-4 mt-2 flex justify-center items-center">
                  <span
                    className="gradient-text-subtitle md:text-xl xs:text-sm text-center xs:mt-2 font-semibold cursor-pointer"
                    onClick={() => {
                      resetForm()
                      setIsDemoMode(false)
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
        )
      }}
    </Formik>
  )
}

export default Form
