import React, { useState } from 'react'
import { Formik, Field } from 'formik'
import * as yup from 'yup'
const priorityOptions = ['1', '2', '3']
const categoryOptions = ['Personal', 'Work', 'Shopping']
import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react'

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
        resetForm,
      }) => (
        <div className="pt-[70px]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center border py-4 mt-10 xl:w-[40%] lg:w-[60%] mx-auto md:w-[80%] xs:w-[80%] "
          >
            {/*  Title  */}
            <div className="flex flex-col md:flex-row w-full md:justify-between md:items-center mb-4 px-4">
              <label
                htmlFor="title"
                className="mb-2 md:mb-0 font-semibold"
              >
                Title:
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={values.title}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder={
                  touched.title && errors.title
                    ? errors.title
                    : 'Enter your task title here'
                }
                className={`border rounded-lg px-2 py-1 w-full md:w-3/4 ${
                  touched.title && errors.title
                    ? 'border-red-500 placeholder-error'
                    : 'border-gray-300'
                }`}
              />
            </div>

            {/*  Description  */}
            <div className="flex flex-col md:flex-row w-full md:justify-between md:items-center mb-4 px-4">
              <label
                htmlFor="description"
                className="mb-2 md:mb-0 font-semibold"
              >
                Description:
              </label>
              <textarea
                id="description"
                type="text"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder={
                  touched.description && errors.description
                    ? errors.description
                    : 'Describe your task '
                }
                className={`border rounded-lg px-2 py-1 w-full md:w-3/4 max-h-[400px] ${
                  touched.description && errors.description
                    ? 'border-red-500 placeholder-error'
                    : 'border-gray-300'
                }`}
              />
            </div>

            {/*  Priority Level  */}
            <div className="flex flex-col md:flex-row w-full md:justify-between md:items-center mb-4 px-4">
              <label
                htmlFor="priority"
                className="mb-2 md:mb-0 font-semibold"
              >
                Priority Level:
              </label>
              <Field
                as="select"
                name="priority"
                className={`border rounded-lg px-2 py-1 w-full md:w-3/4 ${
                  touched.priority && errors.priority
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              >
                <option
                  disabled
                  value=""
                >
                  {touched.priority && errors.priority
                    ? errors.priority
                    : 'Select priority'}
                </option>
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="3">Low</option>
              </Field>
            </div>

            {/*  Category  */}
            <div className="flex flex-col md:flex-row w-full md:justify-between md:items-center mb-4 px-4">
              <label
                htmlFor="category"
                className="mb-2 md:mb-0 font-semibold"
              >
                Category:
              </label>
              <Field
                as="select"
                name="category"
                className={`border rounded-lg px-2 py-1 w-full md:w-3/4 ${
                  touched.category && errors.category
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              >
                <option
                  disabled
                  value=""
                >
                  {touched.category && errors.category
                    ? errors.category
                    : 'Select category'}
                </option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Shopping">Shopping</option>
              </Field>
            </div>

            {/* visibility */}
            <div className="flex flex-col md:flex-row w-full md:justify-between  md:items-center mb-4 px-4">
              <label
                htmlFor="visibility"
                className="mb-2 md:mb-0 font-semibold "
              >
                Visibility:
              </label>
              <div className="flex items-center  mr-[62%] ">
                <Field
                  type="checkbox"
                  name="visibility"
                  id="visibility"
                  className="form-checkbox h-5 w-5 text-gray-500"
                  checked={values.visibility === 'Public'}
                  onChange={() => {
                    const newVisibility =
                      values.visibility === 'Public' ? 'Private' : 'Public'
                    setFieldValue('visibility', newVisibility)
                  }}
                />
                <label
                  htmlFor="visibility"
                  className="ml-2 text-sm"
                >
                  Public
                </label>
              </div>
            </div>

            {/*  Buttons  */}
            <div className="flex flex-row justify-evenly">
              <div className="w-full px-4  flex justify-center items-center">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-[#8f8f8e] hover:bg-[#57ba46] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              <div className="w-full px-4  flex justify-center items-center">
                <Link
                  to="/view-items"
                  className="w-full md:w-auto bg-[#8f8f8e] hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      )}
    </Formik>
  )
}

export default ItemForm
