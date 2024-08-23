export class AddonGroup {
    id: number
    productId: number

    constructor(
        id: number,
        productId: number
    ) {
        this.id = id
        this.productId = productId
    }
}

export class Addon {
    id: number
    groupId: number
    name: string
    price: number

    constructor(
        id: number,
        groupId: number,
        name: string,
        nameAr: string,
        price: number,
    ) {
        this.id = id
        this.groupId = groupId
        this.name = Language.isArabic ? nameAr : name
        this.price = price
    }
}