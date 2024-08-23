import { Request, Response, NextFunction } from 'express'
import { itemQuery, listQuery, modifyQuery } from "../../config/db";
import User from '../../models/user/user';
import Address from '../../models/user/address';

// for Login and Update user
exports.userUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId
    const token: string = req.body.token ?? ""
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email

    if (!userId && !name && !phone && !email) {
        const error = new Error("required filed is missing") as CustomError
        error.status = 400
        throw error 
    }

    let result: { user?: User } = {}

     try {
        const userExist = await itemQuery<User>(`'CALL getUser("${userId}");'`)

        if (!userExist) {
            await modifyQuery(`'CALL newUser("${userId}", "${token}", "${name}", "${phone}", "${email}");'`)
        } else {
            await modifyQuery(`'CALL updateUser("${userId}", "${token}", "${name}", "${phone}", "${email}");'`)
        }
        result.user = await itemQuery<User>(`'CALL getUser("${userId}");'`)
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    

}

exports.recharge = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId
    const amount = req.body.amount

    if (!userId) {
        const error = new Error("required filed is missing") as CustomError
        error.status = 400
        throw error 
    }

    let result: { transactions?: any } = {}

    try {
        const success = await modifyQuery(`'CALL rechargeWallet("${userId}", ${amount});'`)
        if (success) result.transactions = await listQuery(`'CALL getWalletTransactions("${userId}");'`)
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}

exports.userTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId

    if (!userId) {
        const error = new Error("required filed is missing") as CustomError
        error.status = 400
        throw error 
    }

    let result: { transactions?: any } = {}

    try {
        result.transactions = await listQuery(`'CALL getWalletTransactions("${userId}");'`)
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}


exports.address = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId

    if (!userId) {
        const error = new Error("required filed is missing") as CustomError
        error.status = 400
        throw error 
    }

    let result: { address?: Address[] } = {}

    try {
        result.address = await listQuery<Address>(`'CALL getAddress("${userId}");'`)
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}

exports.addAddress = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId
    const name = req.body.name
    const details = req.body.details
    const country = req.body.country
    const city = req.body.city
    const flat = req.body.flat
    const street = req.body.street
    const apartment = req.body.apartment
    const phone = req.body.phone
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    
    if (!userId && !name && !details && !country && !city && !phone && !latitude && !longitude) {
        const error = new Error("required filed is missing") as CustomError
        error.status = 400
        throw error 
    }

    let result: { address?: Address[] } = {}

    try {
        const success = await modifyQuery(`'CALL newAddress(
            "${userId}", 
            "${name}", 
            "${details}", 
            "${country}", 
            "${city}", 
            "${flat}", 
            "${street}", 
            "${apartment}",
            "${phone}",
            ${latitude},
            ${longitude}
            );'`)
        
        if (success) result.address =  await listQuery<Address>(`'CALL getAddress("${userId}");'`)
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}

exports.deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const userId = req.body.userId

    if (!id && !userId) {
        const error = new Error("required filed is missing") as CustomError
        error.status = 400
        throw error 
    }

    let result: { address?: Address[] } = {}

    try {
        const success = await modifyQuery(`'CALL removeAddress("${id}", "${userId}");'`)
        if (success) result.address =  await listQuery<Address>(`'CALL getAddress("${userId}");'`)
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}