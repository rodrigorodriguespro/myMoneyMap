import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')

// Rotas de views
router.on('/').renderInertia('home')
router.on('/singup').renderInertia('singup')
router.on('/dashboard').renderInertia('dashboard')

// Rotas de autenticação
router.post('/register', [AuthController, 'register']).as('auth.register')
router.post('/login', [AuthController, 'login']).as('auth.login')
router.delete('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
router.get('/me', [AuthController, 'me']).as('auth.me')

//Rotas de API
router.resource('user', UsersController)

