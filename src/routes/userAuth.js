import express from 'express'
import { login, logout, refreshToken, signup } from '../controller/userAuth.js'


const userAuthRouter = express.Router()

userAuthRouter.route('/signin').post(login)
userAuthRouter.route('/signout').post(logout)
userAuthRouter.route('/refresh').post(refreshToken)
userAuthRouter.route('/signup').post(signup)

export default userAuthRouter