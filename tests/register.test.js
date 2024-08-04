import request from 'supertest'
import app from '../backend/server'
import User from '../backend/models/UserModel.js'
import { jest } from '@jest/globals'

describe('Tests for /register route', () => {
  let token

  //Test for successful registration
  it('Registered successfully', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'register@test.com',
      fullName: 'Register Test',
      password: '123456',
    })
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('token')
    token = response.body.token
  })

  //Test for invalid email
  it('Should return 400 if email is invalid', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'registertest.com',
      fullName: 'Register Test',
      password: '123456',
    })
    expect(response.statusCode).toBe(400)
  })

  //Test for invalid fullName
  it('Should return 400 if fullName is invalid', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'register@test.com',
      fullName: '',
      password: '123456',
    })
    expect(response.statusCode).toBe(400)
  })

  //Test for invalid password
  it('Should return 400 if password is invalid', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'register@test.com',
      fullName: 'Register Test',
      password: '1234',
    })
    expect(response.statusCode).toBe(400)
  })

  //Test for existing user
  it('Should return 400 and message if user already exists', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'register@test.com',
      fullName: 'Register Test',
      password: '123456',
    })
    expect(response.statusCode).toBe(400)
    expect(response.body.errors[0]).toHaveProperty('msg')
  })

  // Test for simulating a server error during user deletion
  it('Should return 500 on server error in deleteUser', async () => {
    // Mock User.findOneAndDelete to simulate a database error
    jest.spyOn(User, 'findOneAndDelete').mockImplementation(() => {
      throw new Error('Simulated database error')
    })

    // Make sure to use a valid token that corresponds to an existing user
    const response = await request(app)
      .delete('/api/auth/delete')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(500)
    expect(response.text).toContain('Server Error')

    // Restore the original function after the test
    User.findOneAndDelete.mockRestore()
  })

  //Test for deleting user
  it('User deleted successfully', async () => {
    const response = await request(app)
      .delete('/api/auth/delete')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(204)
  })

  // Test for simulating a server error during register
  it('Should return 500 on server error', async () => {
    jest.spyOn(User, 'findOne').mockImplementation(() => {
      throw new Error('Simulated database error')
    })

    const response = await request(app).post('/api/auth/register').send({
      email: 'register@test.com',
      fullName: 'Register Test',
      password: '123456',
    })

    expect(response.statusCode).toBe(500)
    expect(response.text).toContain('Server error')

    User.findOne.mockRestore()
  })
})
