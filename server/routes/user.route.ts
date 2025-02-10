import express from 'express'
import {registerUser,activateUser,loginUser, logOut, updateAccessToken} from '../controllers/userController'
import {isAuthenticated} from '../middleware/auth'
const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/activate',activateUser)
userRouter.post('/login',loginUser)
userRouter.get('/logout',isAuthenticated,logOut)
userRouter.get('/refresh',updateAccessToken)



export default userRouter;