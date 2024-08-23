
import { Request, Response, NextFunction } from 'express'
import { itemQuery, listQuery } from "../../config/db";
import Shop from '../../models/shop/shop';
import Product from '../../models/product/product';

exports.shopsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId
    const userId = req.body.userId
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    
    if (!userId && !categoryId) {
        const error = new Error("user not found") as CustomError
        error.status = 400
        throw error
    } 


    let result: { 
        shops?: Shop[],
     } = {  }
    try {
        result.shops = await listQuery<Shop>(`'CALL getShopsByCategory("${categoryId}", "${userId}", ${latitude}, ${longitude});'`)
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}

exports.shop = async (req: Request, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId
    
    if (!shopId) {
        const error = new Error("shop not found") as CustomError
        error.status = 400
        throw error
    } 


    let result: { 
        shops?: Shop,
     } = {  }
    try {
        const shop = await itemQuery<Shop>(`'CALL getShop("${shopId}");'`)
        shop.slider =  await listQuery<Shop>(`'CALL getSlider("${shopId}");'`)
        shop.productsCategories =  await listQuery<Shop>(`'CALL getShopCategories("${shopId}");'`)
        shop.products =  await listQuery<Product>(`'CALL getShopProducts("${shopId}");'`)
        result.shops = shop
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}