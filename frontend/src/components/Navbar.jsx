import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import { setItemClear } from '../redux/itemSlice'
import { IoMdMenu } from 'react-icons/io'

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const [heading, setHeading] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [fontStyle, setFontStyle] = useState(
    () => localStorage.getItem('fontStyle') || 'handwritten',
  )

  useEffect(() => {
    if (fontStyle === 'readable') {
      document.body.classList.add('font-readable')
    } else {
      document.body.classList.remove('font-readable')
    }
    localStorage.setItem('fontStyle', fontStyle)
  }, [fontStyle])

  useEffect(() => {
    document.body.classList.add('board-wood')
  }, [])

  /*  Close mobile menu on route change */
  useEffect(() => setIsMenuOpen(false), [location])

  /*  Page heading  */
  useEffect(() => {
    const map = {
      '/view-items': 'Items Pending',
      '/view-done': 'Items Done',
      '/add-item': 'Add Item',
      '/modify-item': 'Update Item',
      '/delete-item': 'Delete Item',
    }
    setHeading(map[location.pathname] || 'Mern Todo')
  }, [location])

  const handleLogout = () => {
    dispatch(setItemClear())
    dispatch({ type: 'auth/setLogout' })
    Cookies.remove('token')
    navigate('/')
  }

  const toggleMenu = () => setIsMenuOpen((v) => !v)
  const toggleFont = () =>
    setFontStyle((v) => (v === 'handwritten' ? 'readable' : 'handwritten'))

  const isActive = (path) => location.pathname === path

  if (location.pathname === '/') return null

  return (
    <>
      <div
        className="navbar-board fixed top-0 left-0 z-20 w-screen"
        style={{ height: '68px' }}
      >
        <div
          className="relative flex items-center justify-between h-full px-[4%]"
          style={{ maxWidth: '100vw' }}
        >
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/view-items"
              className={`nav-link-sticky link-yellow ${isActive('/view-items') ? 'nav-active' : ''}`}
            >
              📋 Pending
            </Link>
            <Link
              to="/view-done"
              className={`nav-link-sticky link-pink ${isActive('/view-done') ? 'nav-active' : ''}`}
            >
              ✅ Done
            </Link>
            <Link
              to="/add-item"
              className={`nav-link-sticky link-green ${isActive('/add-item') ? 'nav-active' : ''}`}
            >
              ✏️ Add
            </Link>
          </div>

          <div
            className="absolute inset-x-0 flex justify-center items-center pointer-events-none"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <span className="tape-label">{heading}</span>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleFont}
              className="board-toggle"
              title={
                fontStyle === 'handwritten'
                  ? 'Switch to readable font'
                  : 'Switch to handwritten font'
              }
            >
              {fontStyle === 'handwritten' ? '🔤 Readable' : '✍️ Handwritten'}
            </button>
            <button
              onClick={handleLogout}
              className="nav-link-sticky"
              style={{
                backgroundColor: 'var(--note-lavender)',
                transform: 'rotate(0.8deg)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              🚪 Logout
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleFont}
              className="board-toggle"
              title="Toggle font"
            >
              {fontStyle === 'handwritten' ? '🔤' : '✍️'}
            </button>
            <button
              id="dropdownButton"
              onClick={toggleMenu}
              style={{ color: '#f0ddb8', lineHeight: 0 }}
            >
              <IoMdMenu size="28px" />
            </button>
          </div>

          <div
            id="dropdownMenu"
            className={`${isMenuOpen ? 'flex flex-col py-1' : 'hidden'} dropdown-menu`}
          >
            <Link
              to="/view-items"
              className="dropdown-link"
            >
              📋 Pending
            </Link>
            <Link
              to="/view-done"
              className="dropdown-link"
            >
              ✅ Done
            </Link>
            <Link
              to="/add-item"
              className="dropdown-link"
            >
              ✏️ Add Item
            </Link>
            <button
              onClick={handleLogout}
              className="dropdown-link w-full text-left"
              style={{ background: 'none', cursor: 'pointer' }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
