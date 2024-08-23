export default class Slider {
    id: number
    details: string
    image?: string

    constructor(
        id: number,
        details: string,
        detailsAr: string,
        image?: string
    ) {
        this.id = id
        this.details = Language.isArabic ? detailsAr : details
        this.image = image
    }
}