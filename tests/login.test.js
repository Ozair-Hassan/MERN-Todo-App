import request from 'supertest'
import app from '../backend/server.js'
import User from '../backend/models/UserModel.js'
import { jest } from '@jest/globals'

describe('Tests for /login route', () => {
  let token

  // Test for successful login
  it('Login successfully with proper credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'validemail@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('token')
    token = response.body.token
  })

  // Test for trying to login without email
  it('Should return 400 if email is not added', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: '',
      password: 'validPassword',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
  })

  // Test for trying to login without password
  it('Should return 400 if email is not added', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'validemail@example.com',
      password: '',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
  })
  // Test for trying to login with invalid email
  it('Should return 400 if email is invalid', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'invalidemail@example.com',
      password: 'validPassword',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
  })

  // Test for trying to login with invalid password
  it('Should return 400 if password is not valid', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'validemail@example.com',
      password: 'invalidPassword',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
  })

  // Test for simulating a server error during login
  it('Should return 500 on server error', async () => {
    jest.spyOn(User, 'findOne').mockImplementation(() => {
      throw new Error('Simulated database error')
    })

    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'testPassword',
    })

    expect(response.statusCode).toBe(500)
    expect(response.text).toContain('Server error')

    User.findOne.mockRestore()
  })
})
