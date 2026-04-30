/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
///
/// @ TODO Address Bug in FullName error validation
///

import { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLogin } from '../../redux/authSlice'
import Cookies from 'js-cookie'
import axios from 'axios'

const Pushpin = ({ color = '#dc2626', size = 38 }) => (
  <svg
    width={size}
    height={Math.round(size * 1.55)}
    viewBox="0 0 20 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.35))' }}
  >
    <circle
      cx="10"
      cy="9.5"
      r="8.5"
      fill={color}
    />
    <circle
      cx="10"
      cy="9.5"
      r="8.5"
      stroke="rgba(0,0,0,0.20)"
      strokeWidth="1"
      fill="none"
    />
    <ellipse
      cx="7.2"
      cy="6.8"
      rx="2.6"
      ry="2"
      fill="rgba(255,255,255,0.32)"
    />
    <line
      x1="10"
      y1="18"
      x2="10"
      y2="31"
      stroke="#6b6b6b"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

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

const FieldRow = ({ label, children }) => (
  <div style={{ marginBottom: '1.1rem' }}>
    <label
      className="paper-label"
      style={{ display: 'block', marginBottom: '4px' }}
    >
      {label}
    </label>
    {children}
  </div>
)

const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [pageType, setPageType] = useState('login')
  const [isDemoMode, setIsDemoMode] = useState(false)

  /* Apply saved board theme on the login page too */
  // useEffect(() => {
  //   const theme = localStorage.getItem('boardTheme') || 'cork'
  //   document.body.classList.remove('board-wood')
  //   if (theme === 'wood') document.body.classList.add('board-wood')
  // }, [])

  useEffect(() => {
    document.body.classList.add('board-wood')
  }, [])

  /* Notifications  */
  // const notifyRegister = (state, message = '') => {
  //   const fn = state ? toast.success : toast.error
  //   fn(state ? 'Success, Login to continue' : message || 'Error: Try Again', {
  //     position: 'bottom-center',
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     theme: 'light',
  //     transition: Slide,
  //   })
  // }

  // const notifyLogin = (state, message = '') => {
  //   const fn = state ? toast.success : toast.error
  //   fn(state ? 'Login Successful' : message || 'Error: Try Again', {
  //     position: 'bottom-center',
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     theme: 'light',
  //     transition: Slide,
  //   })
  // }

  /*  Auth functions  unchanged  */
  const login = async (values, onSubmitProps) => {
    try {
      const loginResponse = await axios.post('/api/auth/login', values)
      const token = loginResponse.data.token
      Cookies.set('token', token, { expires: 7 })
      dispatch(setLogin({ token }))
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const userResponse = await axios.get('/api/auth/verifyToken', config)
      dispatch(setLogin({ user: userResponse.data, token }))
      // notifyLogin(true)
      navigate('/view-items')
    } catch (error) {
      const msg =
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        'An error occurred'
      // notifyLogin(false, msg)
      setIsDemoMode(false)
    } finally {
      onSubmitProps.resetForm()
    }
  }

  const register = async (values, onSubmitProps) => {
    try {
      await axios.post('/api/auth/register', values)
      // notifyRegister(true)
      setPageType('login')
      onSubmitProps.resetForm()
    } catch (error) {
      const msg =
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        'An error occurred'
      // notifyRegister(false, msg)
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
          setIsDemoMode(true)
          await login(
            { email: DEMO_EMAIL, password: DEMO_PASSWORD },
            { resetForm: () => {} },
          )
        }

        return (
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
            }}
          >
            {/* Yellow note sticky note */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                transform: 'rotate(-0.8deg)',
                background:
                  'linear-gradient(to bottom, #c9a800 0%, #c9a800 9%, #fef08a 9%)',
                borderRadius: '2px',
                boxShadow:
                  '5px 5px 14px rgba(0,0,0,0.22), 12px 12px 30px rgba(0,0,0,0.13)',
                padding: '3rem 2.2rem 2.4rem',
                willChange: 'transform',
              }}
            >
              {/* fold */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: '0 0 30px 30px',
                  borderColor:
                    'transparent transparent rgba(0,0,0,0.13) transparent',
                }}
              />

              {/* Pushpin */}
              <div
                style={{
                  position: 'absolute',
                  top: '-45px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 5,
                }}
              >
                <Pushpin
                  color="#dc2626"
                  size={38}
                />
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: '2.6rem',
                  fontWeight: 700,
                  color: '#2a1e08',
                  textAlign: 'center',
                  marginBottom: '1.6rem',
                  lineHeight: 1.1,
                }}
              >
                {isLogin ? '📝 Sign In' : '📌 Create Account'}
              </h1>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <FieldRow label="Email">
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
                        : 'you@example.com'
                    }
                    className={`paper-input ${touched.email && errors.email ? 'error' : ''}`}
                    style={{ opacity: isDemoMode ? 0.5 : 1 }}
                  />
                </FieldRow>

                {/* Full name */}
                {isRegister && (
                  <FieldRow label="Full Name">
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
                          : 'Jane Doe'
                      }
                      className={`paper-input ${touched.fullName && errors.fullName ? 'error' : ''}`}
                      style={{ opacity: isDemoMode ? 0.5 : 1 }}
                    />
                  </FieldRow>
                )}

                {/* Password */}
                <FieldRow label="Password">
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
                        : '••••••••'
                    }
                    className={`paper-input ${touched.password && errors.password ? 'error' : ''}`}
                    style={{ opacity: isDemoMode ? 0.5 : 1 }}
                  />
                </FieldRow>

                {/* Divider line  */}
                <div
                  style={{
                    borderBottom: '1.5px dashed rgba(0,0,0,0.16)',
                    margin: '1.2rem 0',
                  }}
                />

                {/* Submit */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '0.6rem',
                  }}
                >
                  <button
                    type="submit"
                    disabled={isDemoMode}
                    className="paper-btn paper-btn-primary"
                    style={{ width: '100%' }}
                  >
                    {isLogin ? '🔑 Login' : '📬 Register'}
                  </button>
                </div>

                {/* Demo login */}
                {isLogin && (
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '1rem',
                      color: '#5a4010',
                      fontFamily: 'var(--font-hand)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Just browsing?{' '}
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={isDemoMode}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontFamily: 'var(--font-hand)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: '#7c4f00',
                      }}
                    >
                      👤 Try the demo
                    </button>
                  </div>
                )}

                {/* Toggle login / register */}
                <div style={{ textAlign: 'center' }}>
                  <span
                    className="gradient-text-subtitle"
                    style={{ fontSize: '1.05rem' }}
                    onClick={() => {
                      resetForm()
                      setIsDemoMode(false)
                      setPageType(isLogin ? 'register' : 'login')
                    }}
                  >
                    {isLogin
                      ? "Don't have an account? Sign up here."
                      : 'Already have an account? Login here.'}
                  </span>
                </div>
              </form>
            </div>
          </div>
        )
      }}
    </Formik>
  )
}

export default Form
