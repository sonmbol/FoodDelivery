export default class Branch {
    id: number
    address: string
    latitude: number
    longitude: number

    constructor(
        id: number,
        address: string,
        latitude: number,
        longitude: number
    ) {
        this.id = id
        this.address = address
        this.latitude = latitude
        this.longitude = longitude
    }
}