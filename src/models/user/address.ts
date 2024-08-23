export default class Address {
    id: string
    userId: string
    name: string
    details: string
    country: string
    city: string
    flat: string
    street: string
    apartment: string
    phone: string
    latitude: number
    longitude: number

    constructor(
        id: string,
        userId: string,
        name: string,
        details: string,
        country: string,
        city: string,
        flat: string,
        street: string,
        apartment: string,
        phone: string,
        latitude: number,
        longitude: number
    ) {
        this.id = id
        this.userId = userId
        this.name = name
        this.details = details
        this.country = country
        this.city = city
        this.flat = flat
        this.street = street
        this.apartment = apartment
        this.phone = phone
        this.latitude = latitude
        this.longitude = longitude
    }
}