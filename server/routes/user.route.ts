import express from 'express'
import {registerUser,activateUser,loginUser, logOut} from '../controllers/userController'
const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/activate',activateUser)
userRouter.post('/login',loginUser)
userRouter.get('/logout',logOut)



export default userRouter;