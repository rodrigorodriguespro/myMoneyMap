import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controller')

router.on('/').renderInertia('home')
router.on('/singup').renderInertia('singup')
router.on('/dashboard').renderInertia('dashboard')

router.resource('user', UsersController)

router
  .group(() => {
    router.get('posts', () => {})
    router.get('users', () => {})
    router.get('payments', () => {})
  })
  .prefix('api')
  .use(middleware.auth())
