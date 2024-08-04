import React from 'react'

const Selector = ({ value, handleChange, title, valueArray }) => {
  return (
    <>
      <span className="sm:mx-2 mx-0 sm:text-md text-sm font-semibold ">
        {title}
      </span>
      <select
        onChange={handleChange}
        value={value}
        className="sm:text-md text-sm font-normal "
      >
        {valueArray.map((obj, index) => (
          <option
            key={index}
            value={obj.value}
          >
            {obj.title}
          </option>
        ))}
      </select>
    </>
  )
}

export default Selector
