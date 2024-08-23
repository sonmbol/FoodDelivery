
import { Request, Response, NextFunction } from 'express'
import { itemQuery, listQuery, modifyQuery } from "../../config/db";
import Ticket from '../../models/ticket/ticket';
import Order from '../../models/ticket/order';
import Address from '../../models/user/address';

exports.orders = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId
    
    if (!userId) {
        const error = new Error("user not found") as CustomError
        error.status = 400
        throw error
    } 


    let result: { 
        tickets?: Ticket[],
     } = {  }
    try {
        const tickets: [Ticket] = await listQuery<Ticket>(`'CALL getTicket("${userId}");'`)
        const orders: [Order] = await listQuery<Order>(`'CALL getUserOrder("${userId}");'`)

        tickets.forEach(async ticket => {
            const ticketOrders = orders.filter(order => { return order.ticketId = ticket.id })
            ticket.address = await itemQuery<Address>(`'CALL getAddress("${userId}");'`)
            ticket.orders = ticketOrders
            return ticketOrders
        })

        result.tickets = tickets
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}

exports.bookOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId
    const addressId = req.body.addressId
    const products = req.body.products
    const delivery = +req.body.delivery
    const discount = +req.body.discount
    const total = +req.body.total
    
    if (!userId && !addressId && !products && !delivery && !discount && !total) {
        const error = new Error("order not found") as CustomError
        error.status = 400
        throw error
    } 


    let result: { 
        success?: boolean,
     } = {  }
    try {
        result.success = await modifyQuery(`'call bookOrder(
            "${userId}",
            "${addressId}",
            "${products}",
            ${delivery},
            ${discount},
            ${total},
            )'`)
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}