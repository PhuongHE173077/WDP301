import { StatusCodes } from "http-status-codes"
import ms from "ms"
import { env } from "~/config/environment"
import { JwtProvider } from "~/providers/JwtProvider"
import { pickUser } from "~/utils/algorithms"
import ApiError from "~/utils/ApiError"
import bcrypt from 'bcryptjs'

import Tenant from "~/models/tenantModel"
import OrderRoom from "~/models/orderModel"

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

const createAndAssign = async (req, res, next) => {
    try {
        const { displayName, email, password, phone, orderId, startAt, endAt } = req.body

        const existingUser = await Tenant.findOne({ email })
        if (existingUser) return next(new ApiError(StatusCodes.BAD_REQUEST, 'Email đã tồn tại!'))

        const hashedPassword = bcrypt.hashSync(password, 10)

        const newTenant = await Tenant.create({
            displayName,
            email,
            password: hashedPassword,
            phone,
            userName: email.split('@')[0]
        })

        const order = await OrderRoom.findById(orderId)
        if (!order) return next(new ApiError(StatusCodes.NOT_FOUND, 'Đơn thuê không tồn tại!'))

        order.tenantId = newTenant._id
        order.startAt = startAt || null
        order.endAt = endAt || null

        await order.save()

        res.status(StatusCodes.CREATED).json({
            message: 'Tạo tài khoản và gán phòng thành công',
            tenant: pickUser(newTenant),
            order: order
        })

    } catch (error) {
        next(error)
    }
}


export const tenantController = {
    getAll,
    login,
    register,
    createAndAssign
}