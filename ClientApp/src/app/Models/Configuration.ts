import * as atlas from "azure-maps-control";
import { PrivateKey } from "../../../../wwwroot/privatekey"


export class Configuration {

    public static _zoom = 15;
    private static _minZoom = 0;
    private static _maxZoom = 23;
    private static _duration = 1000;
    private static _type = 'fly';

    public static Map(): atlas.Map {
        return new atlas.Map("mapContainer", {
            // pitch: 45,
            view: "Auto",
            style: "grayscale_dark",
            language: "pl-PL",
            showLogo: false,
            showFeedbackLink: false,



            authOptions: {
                authType: atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: PrivateKey.AzureMapsAPI //+ 1,
            },
        });
    }

    public static Traffic(
        enableIncidents: boolean,
        flow?: "none" | "relative" | "absolute" | "relative-delay"
    ) {
        return {
            incidents: enableIncidents ? false : true,
            flow: flow ? flow : 'relative'
        };
    }

    public static Camera(
        position: atlas.data.Position,
        options?: atlas.CameraOptions
    ): atlas.CameraOptions {

        if (options == null)
            options = {};

        return {
            zoom: options.zoom ? options.zoom : this._zoom,
            minZoom: options.minZoom ? options.minZoom : this._minZoom,
            maxZoom: options.maxZoom ? options.maxZoom : this._maxZoom,
            duration: options.duration ? options.duration : this._duration,
            type: options.type ? options.type : this._type,
            pitch: 0,
            // bearing: 90,

            center: position
            // center: new atlas.data.Position(position.latitude, position.longitude)
        }
    }
}
