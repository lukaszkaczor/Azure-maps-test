import * as atlas from "azure-maps-control";

export class PathManager {

    private _map: atlas.Map;
    private _path: atlas.data.LineString;
    private _datasource: atlas.source.DataSource;
    private _layer: atlas.layer.LineLayer;

    constructor(map: atlas.Map) {
        this._map = map;
        this._datasource = new atlas.source.DataSource();
        this._map.sources.add(this._datasource);
        this._layer = new atlas.layer.LineLayer(this._datasource);
        this._map.layers.add(this._layer);
        this._path = new atlas.data.LineString([]);

        this.DefaultLayerOptions();
    }

    public AddPosition(position: atlas.data.Position) {
        this._path.coordinates.push(position);
    }

    public AddPositionAndSave(position: atlas.data.Position) {
        this.AddPosition(position);
        this.Save();
    }

    public Save() {
        this._datasource.add(this._path);
    }

    public SetOptions(options: atlas.LineLayerOptions) {
        this._layer.setOptions(options);
    }

    private DefaultLayerOptions() {
        this._layer.setOptions({
            strokeWidth: 4
        })
    }
}