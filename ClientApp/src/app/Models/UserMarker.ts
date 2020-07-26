import * as atlas from "azure-maps-control";

export class UserMarker {

    private _map: atlas.Map;
    private _datasource: atlas.source.DataSource;
    private static symbolLayer: atlas.layer.SymbolLayer;
    private _userPosition: atlas.data.Position;

    constructor(map: atlas.Map, userPosition: atlas.data.Position) {
        this._map = map;
        this._datasource = new atlas.source.DataSource();
        this._map.sources.add(this._datasource);
        this._userPosition = userPosition;
        this._datasource.add(new atlas.data.Feature(new atlas.data.Point(this._userPosition)));
    }

    public async Init() {
        await this._map.imageSprite.createFromTemplate('userIcon', 'triangle-arrow-up', '#000', '#fff').then(() => {
            UserMarker.symbolLayer = new atlas.layer.SymbolLayer(this._datasource, null, this.DefaultSymbolLayerOptions());
            this._map.layers.add(UserMarker.symbolLayer)
        });
    }

    private DefaultSymbolLayerOptions(): atlas.SymbolLayerOptions {
        return {
            iconOptions: {
                image: 'userIcon',
                rotationAlignment: 'map',
                anchor: 'center'
            }
        }
    }

    public GetSymbolLayer() {
        return UserMarker.symbolLayer;
    }

    public async SetLayerOptions(options: atlas.SymbolLayerOptions) {
        await UserMarker.symbolLayer.setOptions(options)
    }

    public SetMarkerPosition(position: atlas.data.Position) {
        const marker = this._datasource.getShapes()[0];
        marker.setCoordinates(position);
    }

    // async SetOptions() {
    //     UserMarker.symbolLayer.setOptions({
    //         iconOptions: {
    //             rotation: 90
    //         }
    //     })
    // }

}