export class Coordinates {
    public latitude: number;
    public longitude: number;
    public accuracy?: number
    public heading?: number;
    public speed?: number;
    public altitude?: number;
    public altitudeAccuracy?: number;


    constructor(lat: number, lng: number) {

    }
}