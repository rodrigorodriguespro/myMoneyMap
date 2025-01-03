import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')

// Rotas de views
router.on('/').renderInertia('home')
router.on('/singup').renderInertia('singup')
router.on('/dashboard').renderInertia('dashboard')
router.on('/overview').renderInertia('dashboard')

// Rotas de autenticação
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.delete('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('/auth')

//Rotas de API
router.resource('user', UsersController)
