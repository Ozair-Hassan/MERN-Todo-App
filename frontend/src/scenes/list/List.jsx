/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Selector from '../../components/Selector'
import axios from 'axios'
import {
  setItems,
  setViewedItems,
  setMarkedDone,
  setMarkedIncomplete,
} from '../../redux/itemSlice'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../components/Loader'
import ListItem from '../../components/ListItem'
import NoItemsFound from '../../components/NoItemsFound'

const List = ({ isDone, initalPriority }) => {
  const dispatch = useDispatch()

  const evaluatePerPage = () => {
    if (window.innerWidth > 1024) {
      return 6
    }
    if (window.innerWidth < 1024 && window.innerWidth > 768) {
      return 4
    }
    if (window.innerWidth < 768) {
      return 2
    }
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(3)
  const [perPage, setPerPage] = useState(evaluatePerPage())
  const items = useSelector((state) => state.item.items)
  const viewedItems = useSelector((state) => state.item.viewedItems)

  const [selectedPriority, setSelectedPriority] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedVisibility, setSelectedVisibility] = useState('Public')

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleVisibilityChange = (e) => {
    setSelectedVisibility(e.target.value)
  }

  const itemIncompleteNumber = useSelector(
    (state) => state.item.markedIncomplete,
  )
  const itemDoneNumber = useSelector((state) => state.item.markedDone)

  const getTotalDoneLength = async (
    isDone,
    selectedCategory,
    selectedVisibility,
  ) => {
    setLoading(true)
    const token = Cookies.get('token')
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const params = {
        isDone,
        selectedCategory,
        selectedVisibility,
      }

      const itemCountResponse = await axios.get('/api/item/length', {
        params,
        ...config,
      })
      const itemCount = itemCountResponse.data
      if (isDone) {
        dispatch(setMarkedDone({ itemCount }))
      } else {
        dispatch(setMarkedIncomplete({ itemCount }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchItems = async (
    isDone,
    selectedPriority,
    selectedCategory,
    selectedVisibility,
  ) => {
    setLoading(true)
    const token = Cookies.get('token')
    if (token) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        const starting = pageNumber === 1 ? 0 : (pageNumber - 1) * perPage

        const params = {
          starting,
          ending: starting + perPage,
          isDone,
          selectedPriority,
          selectedCategory,
          selectedVisibility,
        }

        const itemsResponse = await axios.get('/api/item/fetch', {
          params,
          ...config,
        })
        const items = itemsResponse.data

        // Ensure items are not null or empty
        if (items && items.length > 0) {
          dispatch(setItems({ items }))
          dispatch(setViewedItems({ perPage, pageNumber }))
        } else {
          dispatch(setItems({ items: [] }))
          dispatch(setViewedItems({ perPage, pageNumber }))
        }
      } catch (error) {
        console.log(error)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    getTotalDoneLength(isDone, selectedCategory, selectedVisibility)

    let timeout
    timeout = setTimeout(() => {
      fetchItems(isDone, selectedPriority, selectedCategory, selectedVisibility)
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [
    isDone,
    pageNumber,
    selectedPriority,
    selectedCategory,
    selectedVisibility,
  ])

  useEffect(() => {
    setPageNumber(1)
    setSelectedPriority(0)
    setSelectedCategory('All')
    setSelectedVisibility('Public')
  }, [isDone])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setPerPage(6)
      }
      if (window.innerWidth < 1024 && window.innerWidth > 768) {
        setPerPage(4)
      }
      if (window.innerWidth < 768) {
        setPerPage(2)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (items) {
      if (items.length < perPage) {
        fetchItems(
          isDone,
          selectedPriority,
          selectedCategory,
          selectedVisibility,
        )
      } else {
        dispatch(setViewedItems({ perPage, pageNumber }))
      }
    }
  }, [perPage])

  useEffect(() => {
    setPageNumber(1)
  }, [selectedCategory])

  useEffect(() => {
    if (isDone) {
      if (itemDoneNumber) {
        const number = Math.ceil(itemDoneNumber / perPage)
        setTotalPages(Array.from({ length: number }, (_, index) => index))
      }
    } else {
      if (itemIncompleteNumber) {
        const number = Math.ceil(itemIncompleteNumber / perPage)
        setTotalPages(Array.from({ length: number }, (_, index) => index))
      }
    }
  }, [
    itemDoneNumber,
    itemIncompleteNumber,
    perPage,
    isDone,
    selectedPriority,
    selectedCategory,
    selectedVisibility,
  ])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="flex flex-col justify-center h-screen sm:space-y-20 space-y-2 list-container">
      <div className="flex flex-col sm:flex-row items-center xs:pt-14 sm:pt-16 md:pt-20  justify-center ">
        <Selector
          value={selectedPriority}
          title="Sorted by Priority:"
          valueArray={[
            { value: 0, title: 'None' },
            { value: 1, title: 'High to Low' },
            { value: -1, title: 'Low to High' },
          ]}
          handleChange={handlePriorityChange}
        />
        <Selector
          value={selectedCategory}
          title="Filter by Category:"
          valueArray={[
            { value: 'All', title: 'All' },
            { value: 'Personal', title: 'Personal' },
            { value: 'Work', title: 'Work' },
            { value: 'Shopping', title: 'Shopping' },
          ]}
          handleChange={handleCategoryChange}
        />
        <Selector
          value={selectedVisibility}
          valueArray={[
            { value: 'Public', title: 'Public' },
            { value: 'Private', title: 'Private' },
          ]}
          title="Filter by Visibility:"
          handleChange={handleVisibilityChange}
        />
      </div>
      {viewedItems.length ? (
        <div className=" mx-[5%]  ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mx-[5%]">
            {viewedItems.map((item, index) => (
              <ListItem
                item={item}
                key={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className=" mx-[5%] h-96 ">
            <div className="flex flex-col h-96   mx-[5%]">
              <NoItemsFound />
            </div>
          </div>
        </>
      )}
      {viewedItems.length ? (
        <>
          {' '}
          <div className="flex flex-row justify-evenly xs:pt-4 ">
            <button
              className={`hover:bg-gray-200 border text-sm  rounded px-2 ${[
                pageNumber === 1 &&
                  'cursor-default hover:bg-white border-0 text-gray-400',
              ]}`}
              onClick={() => {
                if (pageNumber >= 2) setPageNumber((v) => v - 1)
              }}
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="left"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
              </svg>
            </button>
            <div className="flex flex-row justify-normal mb-6">
              {totalPages.map((number) => {
                if (number < 3) {
                  return (
                    <span
                      key={number}
                      onClick={() => {
                        console.log(number + 1)
                        setPageNumber(number + 1)
                      }}
                      className={`text-md border border-gray-500 py-1 px-3 mx-2 rounded hover:bg-gray-200 cursor-pointer ${
                        number + 1 === pageNumber && 'border-2 border-green-600'
                      }`}
                    >
                      {number + 1}
                    </span>
                  )
                } else if (number === totalPages.length - 1) {
                  return (
                    // @TODO Bug where hidden number is not being displayed just ...
                    <span key={number}>
                      <span className="text-2xl  px-3 cursor-default  ">
                        ...
                      </span>
                      <span
                        onClick={() => {
                          setPageNumber(number + 1)
                        }}
                        className={`text-md border border-gray-500 py-1 px-3 mx-2 rounded hover:bg-gray-200 cursor-pointer ${
                          number + 1 === pageNumber &&
                          'border-2 border-green-600'
                        }`}
                      >
                        {number + 1}
                      </span>
                    </span>
                  )
                } else {
                  return null
                }
              })}
            </div>
            <button
              className={`hover:bg-gray-200 border text-sm  rounded px-2 ${[
                pageNumber === totalPages.length &&
                  'cursor-default hover:bg-white border-0 text-gray-400',
              ]}`}
              onClick={() => {
                if (
                  pageNumber * perPage >=
                  (isDone ? itemDoneNumber : itemIncompleteNumber)
                )
                  return
                setPageNumber((v) => v + 1)
              }}
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="right"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
              </svg>
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default List
