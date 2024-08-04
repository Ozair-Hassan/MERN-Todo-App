import request from 'supertest'
import app from '../backend/server.js'

describe('Tests for /verifyToken route', () => {
  let token
  let tokenInvalid

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

  // Test for verifyToken route if token is valid
  it('Should return 200 and the user object if token valid', async () => {
    const response = await request(app)
      .get('/api/auth/verifyToken')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).not.toBeNull()
    expect(typeof response.body).toBe('object')
  })

  // Test for verifyToken route if token is not valid
  it('Should return 401 token is not valid', async () => {
    const response = await request(app)
      .get('/api/auth/verifyToken')
      .set('Authorization', `Bearer ${tokenInvalid}`)

    expect(response.statusCode).toBe(401)
    expect(response.body).toBe('Token is not valid')
  })

  // Test for verifyToken route if token is not sent
  it('Should return 403 token is not valid', async () => {
    const response = await request(app).get('/api/auth/verifyToken')

    expect(response.statusCode).toBe(403)
    expect(response.body).toBe('No token, authorization denied')
  })
})
