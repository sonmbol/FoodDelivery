export default class Order {
    id: number
    ticketId: string
    productId: string
    total: number

    constructor(
        id: number,
        ticketId: string,
        productId: string,
        total: number
    ) {
        this.id = id
        this.ticketId = ticketId
        this.productId = productId
        this.total = total
    } 
}