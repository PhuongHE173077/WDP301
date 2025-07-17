import { StatusCodes } from "http-status-codes"
import ms from "ms"
import { env } from "~/config/environment"
import { JwtProvider } from "~/providers/JwtProvider"
import { pickUser } from "~/utils/algorithms"
import ApiError from "~/utils/ApiError"
import bcrypt from 'bcryptjs'

import Tenant from "~/models/tenantModel"
import { cloudinaryProvider } from "~/providers/CloudinaryProvider"

const getAll = async (req, res, next) => {
    try {
        const tenants = await Tenant.find({})

        res.status(StatusCodes.OK).json(tenants)
    } catch (error) {
        next(error)
    }

}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const userExits = await Tenant.findOne({ email })
        if (!userExits) return next(new ApiError(StatusCodes.BAD_REQUEST, 'Email is not exist!'))

        if (!bcrypt.compareSync(password, userExits.password)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'The email or password is incorrect!')

        const userInfo = { _id: userExits._id, email: userExits.email, role: "tenant" }

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
            ...pickUser(userExits),
            role: "tenant"
        }
        res.status(StatusCodes.OK).json(resultData)
    } catch (error) {
        next(error)
    }
}

const register = async (req, res, next) => {
    try {
        const { email, password, displayName } = req.body

        const userExits = await Tenant.findOne({ email })
        if (userExits) return next(new ApiError(StatusCodes.BAD_REQUEST, 'Email đã tồn tại !'))
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newTenant = await Tenant.create({
            email,
            password: hashedPassword,
            userName: email.split('@')[0],
            phone: req.body.phone,
            displayName
        })

        res.status(StatusCodes.OK).json(newTenant)
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const user = await Tenant.findById(req.jwtDecoded._id)

        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

        const updateData = { ...req.body };

        if (req.file) {
            const result = await cloudinaryProvider.streamUpload(req.file.buffer, "users")
            updateData.avatar = result.secure_url;
        }

        if (req.body.currentPassword && req.body.newPassword) {
            if (!bcrypt.compareSync(req.body.currentPassword, user.password)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'The current password is incorrect!')
            updateData.password = bcrypt.hashSync(req.body.newPassword, 10)
            delete updateData.currentPassword;
            delete updateData.newPassword;
        }
        const updatedUser = await Tenant.findByIdAndUpdate(req.jwtDecoded._id, updateData, { new: true })
        res.status(StatusCodes.OK).json(updatedUser)
    } catch (error) {
        next(error)
    }
}

export const tenantController = {
    getAll,
    login,
    register,
    updateProfile
}