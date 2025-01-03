import { test } from '@japa/runner'
import UsersController from './users_controller'
import User from '#models/user'

test.group('UsersController', () => {
    test('index should return all users', async ({ assert }) => {
        const fakeUsers = [
      { id: 1, fullName: 'John Doe', email: 'john@example.com' },
            { id: 2, fullName: 'Jane Smith', email: 'jane@example.com' },
        ]

        // Mock the User.all method
        User.all = async () => fakeUsers as any

        // Mock response object
        const response = {
            json: (data: any) => {
                assert.deepEqual(data, fakeUsers)
            },
        }

        const controller = new UsersController()
        await controller.index({ response } as any)
    })
})
