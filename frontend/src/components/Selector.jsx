/* eslint-disable react/prop-types */

const Selector = ({ value, handleChange, title, valueArray }) => (
  <div
    className="selector-bar"
    style={{ margin: '4px 6px' }}
  >
    <span>{title}</span>
    <select
      onChange={handleChange}
      value={value}
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
  </div>
)

export default Selector
