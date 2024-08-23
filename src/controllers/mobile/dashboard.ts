
import { Request, Response, NextFunction } from 'express'
import { itemQuery, listQuery } from "../../config/db";
import Category from '../../models/category';
import Shop from '../../models/shop/shop';
import Ticket from '../../models/ticket/ticket';
import Product from '../../models/product/product';

exports.dashboard = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    
    if (!userId) {
        const error = new Error("user not found") as CustomError
        error.status = 400
        throw error
    } 


    let result: { 
        categories?: Category[],
        shops?: Shop[],
        popularProducts?: Product[],
        orderAgain?: Ticket[]
     } = {  }
    try {
        result.categories = await listQuery<Category>('CALL getCategories;')
        result.shops = await listQuery<Shop>(`'CALL getShops(${latitude},${longitude});'`)
        result.popularProducts = await listQuery<Product>(`'CALL getPopularProducts(${latitude},${longitude});'`)
        result.orderAgain = await listQuery<Ticket>(`'CALL getPreviousOrder("${userId}");'`)
        await itemQuery<Ticket>(`'CALL trackUser("${userId}");'`)
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}