/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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

/*
   priority indicator
   color: red = high, amber = medium, teal = low
 */
const Pushpin = ({ color = '#dc2626', size = 26 }) => (
  <svg
    width={size}
    height={Math.round(size * 1.55)}
    viewBox="0 0 20 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.35))' }}
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
      rx="2.5"
      ry="1.9"
      fill="rgba(255,255,255,0.30)"
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

const STICKY_CLASSES = [
  'sticky-yellow',
  'sticky-pink',
  'sticky-green',
  'sticky-blue',
  'sticky-lavender',
  'sticky-orange',
]

const ROTATIONS = [-2.4, 1.3, -1.6, 2.1, -0.9, 1.8]

const PIN_COLORS = {
  1: '#dc2626', // High
  2: '#d97706', // Medium
  3: '#16a34a', // Low
}

const PIN_LABELS = { 1: 'High', 2: 'Medium', 3: 'Low' }

const hashId = (id = '') => {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h) % STICKY_CLASSES.length
}

const ListItem = ({ item }) => {
  const [colorIndex] = useState(() =>
    Math.floor(Math.random() * STICKY_CLASSES.length),
  )
  const [rotationIndex] = useState(() =>
    Math.floor(Math.random() * ROTATIONS.length),
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const notify = (state, message = '') => {
    const content = message || (state ? 'Success' : 'Error: Try Again')
    const notifyFunc = state ? toast.success : toast.error
    notifyFunc(content, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      transition: Slide,
    })
  }

  const handleModifyClick = (itemId) => {
    dispatch(setCurrentItemId(itemId))
    navigate('/modify-item')
  }

  const handleStatusChange = async (itemId, isDone, successMessage) => {
    try {
      const token = Cookies.get('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.put(
        `/api/item/modify/${itemId}`,
        { isDone: isDone.toString() },
        config,
      )
      notify(true, successMessage)
      navigate(isDone === 'true' ? '/view-done' : '/view-items')
    } catch (error) {
      notify(
        false,
        error.response?.data?.errors?.[0]?.msg ||
          error.message ||
          'An error occurred',
      )
    }
  }

  const handleDeleteClick = (itemId) => {
    dispatch(setCurrentItemId(itemId))
    navigate('/delete-item')
  }

  if (!item) {
    return (
      <div
        className="sticky-note sticky-yellow text-center"
        style={{ fontFamily: 'var(--font-hand)' }}
      >
        No data available
      </div>
    )
  }

  const colorClass = STICKY_CLASSES[colorIndex]
  const rotation = ROTATIONS[rotationIndex]
  const pinColor = PIN_COLORS[item.priority] || '#6b7280'
  const pinLabel = PIN_LABELS[item.priority] || ''
  const isOwner = item?.userId?._id === user._id

  /* Icon button shared style */
  const iconBtnStyle = {
    background: 'rgba(0,0,0,0.06)',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s, transform 0.15s',
    flexShrink: 0,
  }

  return (
    <div
      className={`sticky-note ${colorClass}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        fontFamily: 'var(--font-hand)',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Pushpin — priority */}
      <div
        style={{
          position: 'absolute',
          top: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
        }}
        title={`Priority: ${pinLabel}`}
      >
        <Pushpin
          color={pinColor}
          size={26}
        />
      </div>

      {/* Note body */}
      <div style={{ paddingTop: '0.25rem', overflow: 'hidden' }}>
        {/* Title */}
        <h2
          style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: '0.5rem',
            textTransform: 'capitalize',
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}
        >
          {item?.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '1rem',
            color: '#333',
            marginBottom: '0.3rem',
            wordBreak: 'break-word',
          }}
        >
          {item?.description}
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
            marginTop: '0.5rem',
          }}
        >
          <span style={chipStyle('#1a1a1a', 'rgba(0,0,0,0.10)')}>
            📁 {item?.category}
          </span>
          <span style={chipStyle('#1a1a1a', 'rgba(0,0,0,0.10)')}>
            {item?.visibility === 'Public' ? '🌍' : '🔒'} {item?.visibility}
          </span>
          {item?.isDone && (
            <span style={chipStyle('#065f46', 'rgba(16,185,129,0.20)')}>
              ✅ Done
            </span>
          )}
        </div>

        {item?.userId?._id !== user._id && (
          <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '0.4rem' }}>
            ✍️ <strong>{item?.userId?.fullName}</strong>
          </p>
        )}
      </div>

      {isOwner && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '0.9rem',
          }}
        >
          {item?.isDone ? (
            /* Undo done */
            <button
              title="Mark Incomplete"
              style={iconBtnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220,38,38,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.06)'
              }}
              onClick={() =>
                handleStatusChange(item._id, 'false', 'Item Marked Incomplete')
              }
            >
              <BiRedo
                size="16px"
                color="#dc2626"
              />
            </button>
          ) : (
            <>
              {/* Mark done */}
              <button
                title="Mark Complete"
                style={iconBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(22,163,74,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.06)'
                }}
                onClick={() =>
                  handleStatusChange(item._id, 'true', 'Item Marked Completed')
                }
              >
                <IoCheckmarkDoneSharp
                  size="16px"
                  color="#16a34a"
                />
              </button>

              {/* Edit */}
              <button
                title="Edit"
                style={iconBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(217,119,6,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.06)'
                }}
                onClick={() => handleModifyClick(item?._id)}
              >
                <CiEdit
                  size="17px"
                  color="#b45309"
                />
              </button>
            </>
          )}

          {/* Delete */}
          <button
            title="Delete"
            style={iconBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220,38,38,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.06)'
            }}
            onClick={() => handleDeleteClick(item?._id)}
          >
            <FaTrashCan
              size="14px"
              color="#dc2626"
            />
          </button>
        </div>
      )}
    </div>
  )
}

const chipStyle = (color, bg) => ({
  display: 'inline-flex',
  alignItems: 'center',
  background: bg,
  color,
  fontSize: '0.88rem',
  fontFamily: 'var(--font-hand)',
  fontWeight: 600,
  padding: '1px 8px',
  borderRadius: '2px',
})

export default ListItem
