/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Formik, Field } from 'formik'
import * as yup from 'yup'
import { Link } from 'react-router-dom'

const Pushpin = ({ color = '#0ea5e9', size = 34 }) => (
  <svg
    width={size}
    height={Math.round(size * 1.55)}
    viewBox="0 0 20 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.32))' }}
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

const categoryOptions = ['Personal', 'Work', 'Shopping']

const valuesSchema = yup.object().shape({
  title: yup.string().required('Required'),
  description: yup.string().required('Required'),
  priority: yup.number().integer().required('Required'),
  category: yup
    .string()
    .oneOf(categoryOptions, 'Invalid category')
    .required('Required'),
  visibility: yup.string().required('Required'),
  isDone: yup.boolean(),
})

const FieldRow = ({ label, error, children }) => (
  <div style={{ marginBottom: '1.1rem' }}>
    <label
      className="paper-label"
      style={{ display: 'block', marginBottom: '4px' }}
    >
      {label}
    </label>
    {children}
    {error && (
      <p
        style={{
          fontFamily: 'var(--font-hand)',
          color: '#dc2626',
          fontSize: '0.95rem',
          marginTop: '2px',
        }}
      >
        ⚠️ {error}
      </p>
    )}
  </div>
)

const ItemForm = ({ initialValues, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async (values, onSubmitProps) => {
    setIsSubmitting(true)
    await onSubmit(values, onSubmitProps)
    setIsSubmitting(false)
  }

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={valuesSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <div
          style={{
            paddingTop: '88px',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '88px 1rem 3rem',
          }}
        >
          {/*  Sticky note card  */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              /* Blue note with glue strip */
              background:
                'linear-gradient(to bottom, #0ea5e9 0%, #0ea5e9 9%, #bae6fd 9%)',
              borderRadius: '2px',
              boxShadow:
                '5px 5px 14px rgba(0,0,0,0.20), 12px 12px 30px rgba(0,0,0,0.12)',
              padding: '3rem 2.2rem 2.4rem',
              transform: 'rotate(0.5deg)',
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
                borderWidth: '0 0 28px 28px',
                borderColor:
                  'transparent transparent rgba(0,0,0,0.12) transparent',
              }}
            />

            {/* Pin */}
            <div
              style={{
                position: 'absolute',
                top: '-18px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
              }}
            >
              <Pushpin
                color="#0ea5e9"
                size={34}
              />
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '2.2rem',
                fontWeight: 700,
                color: '#0c2d4a',
                textAlign: 'center',
                marginBottom: '1.6rem',
                lineHeight: 1.1,
              }}
            >
              Task Details
            </h2>

            {/* Dashed divider */}
            <div
              style={{
                borderBottom: '1.5px dashed rgba(0,0,0,0.18)',
                marginBottom: '1.4rem',
              }}
            />

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <FieldRow
                label="Title"
                error={touched.title && errors.title ? errors.title : null}
              >
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={values.title}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="What needs doing?"
                  className={`paper-input ${touched.title && errors.title ? 'error' : ''}`}
                />
              </FieldRow>

              {/* Description */}
              <FieldRow
                label="Description"
                error={
                  touched.description && errors.description
                    ? errors.description
                    : null
                }
              >
                <textarea
                  id="description"
                  name="description"
                  value={values.description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  rows={3}
                  placeholder="A few more details…"
                  className={`paper-input paper-textarea ${touched.description && errors.description ? 'error' : ''}`}
                  style={{ resize: 'vertical', maxHeight: '200px' }}
                />
              </FieldRow>

              {/* Priority */}
              <FieldRow
                label="Priority"
                error={
                  touched.priority && errors.priority ? errors.priority : null
                }
              >
                <Field
                  as="select"
                  name="priority"
                  className={`paper-input paper-select ${touched.priority && errors.priority ? 'error' : ''}`}
                >
                  <option
                    disabled
                    value=""
                  >
                    Select priority
                  </option>
                  <option value="1">🔴 High</option>
                  <option value="2">🟡 Medium</option>
                  <option value="3">🟢 Low</option>
                </Field>
              </FieldRow>

              {/* Category */}
              <FieldRow
                label="Category"
                error={
                  touched.category && errors.category ? errors.category : null
                }
              >
                <Field
                  as="select"
                  name="category"
                  className={`paper-input paper-select ${touched.category && errors.category ? 'error' : ''}`}
                >
                  <option
                    disabled
                    value=""
                  >
                    Select category
                  </option>
                  <option value="Personal">👤 Personal</option>
                  <option value="Work">💼 Work</option>
                  <option value="Shopping">🛒 Shopping</option>
                </Field>
              </FieldRow>

              {/* Visibility */}
              <div
                style={{
                  marginBottom: '1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <label className="paper-label">Visibility</label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-hand)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#1a1a1a',
                  }}
                >
                  <Field
                    type="checkbox"
                    name="visibility"
                    id="visibility"
                    checked={values.visibility === 'Public'}
                    onChange={() =>
                      setFieldValue(
                        'visibility',
                        values.visibility === 'Public' ? 'Private' : 'Public',
                      )
                    }
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#0ea5e9',
                      cursor: 'pointer',
                    }}
                  />
                  {values.visibility === 'Public' ? '🌍 Public' : '🔒 Private'}
                </label>
              </div>

              {/* Dashed divider */}
              <div
                style={{
                  borderBottom: '1.5px dashed rgba(0,0,0,0.16)',
                  marginBottom: '1.4rem',
                }}
              />

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                }}
              >
                <button
                  type="submit"
                  className="paper-btn paper-btn-primary"
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? '⏳ Saving…' : '📌 Submit'}
                </button>
                <Link
                  to="/view-items"
                  className="paper-btn paper-btn-danger"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✖ Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </Formik>
  )
}

export default ItemForm
