import request from 'supertest'
import app from '../backend/server'

describe('Tests for /items route', () => {
  let token
  let itemID
  let isDone
  let selectedCategory
  let selectedVisibility
  let startIndex = 0
  let endIndex = 6

  // Test for successful login to obtain token
  it('Login successfully with proper credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'validemail@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('token')
    token = response.body.token
  })

  // Test for add item success
  it('Return status 200 and added item object if all data is being sent ', async () => {
    const response = await request(app)
      .post('/api/item/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Item',
        description: 'This is test',
        priority: 3,
        isDone: false,
        category: 'Work',
        visibility: 'Public',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).not.toBeNull()
    expect(typeof response.body).toBe('object')
    expect(response.body).toHaveProperty(['_id'])
    itemID = response.body._id
  })

  // Test for add item if one or more params are not being sent
  it('Return status 200 and added item object if all data is being sent ', async () => {
    const response = await request(app)
      .post('/api/item/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Item',
        description: 'This is test',
        priority: 3,
        isDone: false,
        category: 'Work',
        // visibility: 'Public',
      })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty(['errors'])
  })

  // Test for modify existing item by id
  it('Return status 200 and item if success ', async () => {
    const response = await request(app)
      .put(`/api/item/modify/${itemID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Item',
        description: 'This is test is now done',
        priority: 3,
        isDone: true,
        category: 'Work',
        visibility: 'Public',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).not.toBeNull()
    expect(typeof response.body).toBe('object')
    expect(response.body).toHaveProperty(['_id'])
  })

  // Test for fetch  item by specifc id
  it('Return status 200 and items number as integer ', async () => {
    const response = await request(app)
      .get(`/api/item/fetch/${itemID}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.body).not.toBeNull()
    expect(typeof response.body).toBe('object')
    expect(response.body).toHaveProperty(['_id'])
  })

  // Test for delete item but not authenticated
  it('Return status 401  ', async () => {
    const response = await request(app)
      .delete(`/api/item/delete/${itemID}`)
      .set('Authorization', `Bearer ${null}`)

    expect(response.statusCode).toBe(401)
  })

  // Test for delete item
  it('Return message successfully deleted ', async () => {
    const response = await request(app)
      .delete(`/api/item/delete/${itemID}`)
      .set('Authorization', `Bearer ${token}`)

    // expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('msg')
  })

  // Test for delete item but not it does not exist
  it('Return status 404 with message  ', async () => {
    const response = await request(app)
      .delete(`/api/item/delete/${itemID}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('msg')
  })

  // Test for fetch  item by specifc id but does not exist
  it('Return status 404 and message ', async () => {
    const response = await request(app)
      .get(`/api/item/fetch/${itemID}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('msg')
  })

  // Test for fetch total number of items
  // Params false all public
  it('Return status 200 and items number as integer ', async () => {
    const response = await request(app)
      .get('/api/item/length')
      .set('Authorization', `Bearer ${token}`)
      .query({
        isDone: false,
        selectedCategory: 'All',
        selectedVisibility: 'Public',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).not.toBeNull()
    expect(typeof response.body).toBe('number')
  })

  // Test for fetch all items
  // Params false all public
  it('Return status 200 and items number as integer ', async () => {
    const response = await request(app)
      .get('/api/item/fetch')
      .set('Authorization', `Bearer ${token}`)
      .query({
        isDone: false,
        selectedCategory: 'All',
        selectedVisibility: 'Public',
        startIndex: startIndex,
        endIndex: endIndex,
      })

    expect(response.statusCode).toBe(200)
    expect(typeof response.body).toBe('object')
  })
  // Test for fetch all items
  // Params false work private
  it('Return status 200 and items number as integer ', async () => {
    const response = await request(app)
      .get('/api/item/fetch')
      .set('Authorization', `Bearer ${token}`)
      .query({
        isDone: false,
        selectedCategory: 'Work',
        selectedVisibility: 'Private',
        startIndex: startIndex,
        endIndex: endIndex,
      })

    expect(response.statusCode).toBe(200)
    expect(typeof response.body).toBe('object')
  })
})
