import * as atlas from "azure-maps-control";

export class UsersMarker {

    public static symbolLayer: atlas.layer.SymbolLayer;

    getSymbolLayer() {
        return UsersMarker.symbolLayer;
    }

    async drawUsersMarker(map, datasource) {

        // let symbolLayer: atlas.layer.SymbolLayer;
        let layerOptions: atlas.SymbolLayerOptions;

        await map.imageSprite.createFromTemplate('myTemplatedIcon', 'triangle-arrow-up', 'teal', '#fff').then(() => {
            //Add a symbol layer that uses the custom created icon.
            UsersMarker.symbolLayer = new atlas.layer.SymbolLayer(datasource, null, {
                iconOptions: {
                    image: 'myTemplatedIcon',
                    rotationAlignment: 'map',
                    // pitchAlignment: 'viewport'
                    // rotation: 90
                }
            })
            map.layers.add(UsersMarker.symbolLayer);
            layerOptions = UsersMarker.symbolLayer.getOptions();
            // console.log(e)
        })
        // UsersMarker.symbolLayer.set
        return layerOptions;
    }

    async setOptions() {
        UsersMarker.symbolLayer.setOptions({
            iconOptions: {
                rotation: 90
            }

        })
    }

}