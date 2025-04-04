import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const WorkspaceController = () => import('#controllers/workspaces_controller')
const AccountBanksController = () => import('#controllers/register/account_banks_controller')
const AccountCreditBanksController = () => import('#controllers/register/account_credit_banks_controller')
const CategoriesController = () => import('#controllers/register/categories_controller')

// Rotas de views
router.on('/').renderInertia('home')
router.on('/singup').renderInertia('singup')
router.on('/dashboard').renderInertia('dashboard')
router.on('/overview').renderInertia('overview')
router.on('/register/categories').renderInertia('register/categories')

// Rotas registros de contas
router.on('/register/accounts').renderInertia('register/accounts')

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
router.resource('workspace', WorkspaceController)

// Rotas de Registros de contas
router
  .group(() => {
    router.resource('account_banks', AccountBanksController)
    router.resource('account_credit_banks', AccountCreditBanksController)
    router.resource('categories', CategoriesController)
  })
  .prefix('/api/register')
  .use(middleware.auth())
