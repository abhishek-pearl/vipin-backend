import express from 'express'
import { getUserData, login, logout, refreshToken, signup } from '../controller/userAuth.js'
import { verifyTokenMiddleware } from '../middleware/verifyTokenMiddleware.js'


const userAuthRouter = express.Router()

userAuthRouter.route('/signin').post(login)
userAuthRouter.route('/signout').post(logout)
userAuthRouter.route('/refresh').post(refreshToken)
userAuthRouter.route('/signup').post(signup)
userAuthRouter.route('/userData').get(verifyTokenMiddleware,getUserData)

export default userAuthRouter