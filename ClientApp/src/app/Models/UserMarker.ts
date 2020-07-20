import * as atlas from "azure-maps-control";

export class UserMarker {

    private _map: atlas.Map;
    private _datasource: atlas.source.DataSource;
    private static symbolLayer: atlas.layer.SymbolLayer;

    constructor(map: atlas.Map, userPosition: atlas.data.Position) {
        this._map = map;
        this._datasource = new atlas.source.DataSource();
        this._map.sources.add(this._datasource);
        this._datasource.add(new atlas.data.Feature(new atlas.data.Point(userPosition)));

        this.Init();
    }

    private async Init() {
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

    public SetLayerOptions(options: atlas.SymbolLayerOptions) {
        UserMarker.symbolLayer.setOptions(options)
    }

    async SetOptions() {
        UserMarker.symbolLayer.setOptions({
            iconOptions: {
                rotation: 90
            }
        })
    }

}