export default class User {
    userId: string
    token: string
    name: string
    email: string
    phone: string
    balance: number
    image?: string

    constructor(
        userId: string,
        token: string,
        name: string,
        email: string,
        phone: string,
        balance: number,
        image?: string
    ) {
        this.userId = userId
        this.token = token
        this.name = name
        this.email = email
        this.phone = phone
        this.balance = balance
        this.image = image
    }
}