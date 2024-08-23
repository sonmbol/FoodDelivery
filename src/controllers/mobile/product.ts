
import { Request, Response, NextFunction } from 'express'
import { itemQuery, listQuery } from "../../config/db";
import Shop from '../../models/shop/shop';
import Product from '../../models/product/product';
import { Addon, AddonGroup } from '../../models/product/addon';

exports.product = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId
    const userId = req.body.userId
    
    if (!userId && !productId) {
        const error = new Error("product not found") as CustomError
        error.status = 400
        throw error
    } 


    let result: { 
        product?: Product,
     } = {  }
    try {
        const product = await itemQuery<Product>(`'CALL getProduct("${productId}");'`)
        product.addonGroup = await listQuery<AddonGroup>(`'CALL getAddonGroup("${productId}");'`)
        product.addon = await listQuery<Addon>(`'CALL getAddon("${productId}");'`)
        product.slider = await listQuery<Shop>(`'CALL getProductSlider("${productId}");'`)
        result.product = product
    } catch (err) {
        console.log(err)
        throw err
    }

    res.status(200).send(result)    
}
