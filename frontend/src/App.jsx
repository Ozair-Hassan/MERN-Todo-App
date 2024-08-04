/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { setLogin, setLogout } from './redux/authSlice'
import { setItemClear, setItems } from './redux/itemSlice'
import UpdateItem from './scenes/modifyItem/UpdateItem'
import List from './scenes/list/List'
import DeleteItem from './scenes/deleteItem/DeleteItem'
import AddItem from './scenes/addItem/AddItem'
import LoginPage from './scenes/loginPage/LoginPage'
import Loader from './components/Loader'
import PageNotFound from './components/PageNotFound'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'

const App = () => {
  const dispatch = useDispatch()

  const isAuth = useSelector((state) => Boolean(state.auth.token))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get('token')
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          const response = await axios.get('/api/auth/verifyToken', config)
          const user = response.data

          dispatch(setLogin({ user, token }))
        } catch (error) {
          Cookies.remove('token')
          dispatch(setItemClear())
          dispatch(setLogout())
        }
      }
      setLoading(false)
    }

    verifyToken()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Slide
      />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={isAuth ? <Navigate to="/view-items" /> : <LoginPage />}
          />
          <Route
            path="/view-items"
            element={isAuth ? <List isDone={false} /> : <Navigate to="/" />}
          />
          <Route
            path="/view-done"
            element={isAuth ? <List isDone /> : <Navigate to="/" />}
          />
          <Route
            path="/add-item"
            element={isAuth ? <AddItem /> : <Navigate to="/" />}
          />
          <Route
            path="/modify-item"
            element={isAuth ? <UpdateItem /> : <Navigate to="/" />}
          />

          <Route
            path="/delete-item"
            element={isAuth ? <DeleteItem /> : <Navigate to="/" />}
          />
          <Route
            path="*"
            element={<PageNotFound />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
