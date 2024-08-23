import Address from "../user/address"
import Order from "./order"

export default class Ticket {
    id: string
    userId: string
    shopId: string
    addressId: string
    payment: string
    delivery: number
    discount: string
    address?: Address
    orders?: Order[]

    constructor(
        id: string,
        userId: string,
        shopId: string,
        addressId: string,
        payment: string,
        delivery: number,
        discount: string,
        orders?: Order[]
    ) {
        this.id = id
        this.userId = userId
        this.shopId = shopId
        this.addressId = addressId
        this.payment = payment
        this.delivery = delivery
        this.discount = discount
        this.orders = orders
    } 
}