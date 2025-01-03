import { test } from '@japa/runner'
import User from '#models/user'
import UsersController from '#controllers/users_controller'
import axios from 'axios'

test.group('Users create', () => {
  test('store method creates a new user', async ({ assert }) => {
    const userData = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      password: 'secret123',
    }

    const response = await axios.post('/users', userData)

    assert.equal(response.status, 201)
    assert.exists(response.data.id, 'User ID should exist')
    assert.equal(response.data.fullName, userData.fullName)
    assert.equal(response.data.email, userData.email)

    const user = await User.find(response.data.id)
    assert.isNotNull(user, 'User should be created in the database')
  })
})
