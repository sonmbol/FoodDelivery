export default class Category {
    id: number
    name: string
    image?: string

    constructor(
        id: number,
        name: string,
        nameAr: string,
        image?: string
    ) {
        this.id = id
        this.name = Language.isArabic ? nameAr : name 
        this.image = image
    }
}