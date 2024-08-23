import Category from "../category";
import Product from "../product/product";
import Slider from "../slider";
import Branch from "./branch";

enum StatusType {
    close = 0,
    open = 1
}

class ShopInfo {
    phone: string
    email: string
    rate: string

    constructor(
        phone: string,
        email: string,
        rate: string
        ) {
            this.phone = phone
            this.email = email
            this.rate = rate
        }
}

export default class Shop {
    id: number
    branch: Branch
    categoryId: string
    name: string
    details: string
    image: string
    info: ShopInfo
    status: StatusType
    slider?: Slider[]
    productsCategories?: Category[]
    products?: Product[]

    constructor(
        id: number,
        branchId: number,
        categoryId: string,
        address: string,
        latitude: number,
        longitude: number,
        name: string,
        nameAr: string,
        details: string,
        detailsAr: string,
        image: string,
        phone: string,
        email: string,
        rate: string,
        status: number
    ) {
       this.id = id
       this.branch = new Branch(branchId, address, latitude, longitude)
       this.categoryId = categoryId
       this.name =  Language.isArabic ? nameAr : name
       this.details = Language.isArabic ? detailsAr : details
       this.image = image
       this.info = new ShopInfo(phone, email, rate)
       this.status = status as StatusType
    }

}