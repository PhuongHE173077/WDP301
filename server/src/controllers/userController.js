import { StatusCodes } from "http-status-codes"
import User from "~/models/userModal"
import ApiError from "~/utils/ApiError"
import bcrypt from 'bcryptjs'
import { JwtProvider } from "~/providers/JwtProvider"
import { pickUser } from "~/utils/algorithms"
import { env } from "~/config/environment"
import ms from "ms"

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const userExits = await User.findOne({ email })
        if (!userExits) return next(new ApiError(StatusCodes.BAD_REQUEST, 'Email is not exist!'))

        if (!userExits.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'This account is not activated!')

        if (!bcrypt.compareSync(password, userExits.password)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'The email or password is incorrect!')

        const userInfo = { _id: userExits._id, email: userExits.email, role: userExits.role }

        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.ACCESS_TOKEN_LIFE
        )

        const refreshToken = await JwtProvider.generateToken(
            userInfo,
            env.REFRESH_TOKEN_SECRET_SIGNATURE,
            env.REFRESH_TOKEN_LIFE
        )

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: ms('14 days')
        })


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: ms('14 days')
        })


        const resultData = {
            accessToken,
            refreshToken,
            ...pickUser(userExits)
        }
        res.status(StatusCodes.OK).json(resultData)
    } catch (error) {
        next(error)
    }
}

const getAllUser = async (req, res, next) => {
    try {
        const user = req.jwtDecoded._id
        const users = await User.find()
        // throw new ApiError(StatusCodes.OK, 'Get all user successfully!')
        res.status(StatusCodes.OK).json(users)
    } catch (error) {
        next(error)
    }
}


const logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

        res.status(StatusCodes.OK).json({ message: 'Logout successfully!' })
    } catch (error) {
        next(error)
    }
}



export const userController = {
    login,
    getAllUser,
    logout
}