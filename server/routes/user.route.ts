import express from 'express'
import {registerUser,activateUser,loginUser, logOut, updateAccessToken, getUserInfo, socialAuth, updateUserInfo, updateUserPassword, updateProfilePicture} from '../controllers/userController'
import {isAuthenticated} from '../middleware/auth'
const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/activate',activateUser)
userRouter.post('/login',loginUser)
userRouter.get('/logout',isAuthenticated,logOut)
userRouter.get('/refresh',updateAccessToken)

userRouter.get('/me',isAuthenticated,getUserInfo)
userRouter.post('/social-auth',socialAuth)
userRouter.put('/update-user-info',isAuthenticated,updateUserInfo)
userRouter.put('/update-user-password',isAuthenticated,updateUserPassword)
userRouter.put('/update-user-avatar',isAuthenticated,updateProfilePicture)





export default userRouter;