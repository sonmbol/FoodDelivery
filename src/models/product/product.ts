import Slider from "../slider"
import { Addon, AddonGroup } from "./addon"

export default class Product {
    id: number
    categoryId: number
    qty: number
    name: string
    image: string
    price: number
    discount: number
    addonGroup?: AddonGroup[]
    addon?: Addon[]
    slider?: Slider[]

    constructor(
        id: number,
        categoryId: number,
        qty: number,
        name: string,
        nameAr: string,
        image: string,
        price: number,
        discount: number
    ) {
        this.id = id
        this.categoryId = categoryId
        this.qty = qty
        this.name = Language.isArabic ? nameAr : name
        this.image = image
        this.price = price
        this.discount = discount
    }
}