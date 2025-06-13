import { StatusCodes } from "http-status-codes"

const getAll = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id


        res.status(StatusCodes.OK).json(tenants)
    } catch (error) {
        next(error)
    }

}

export const tenantController = {
    getAll
}