import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import * as atlas from 'azure-maps-control';
import * as route from 'azure-maps-rest';
import { Configuration } from '../../Models/Configuration';
import { Geolocation } from '../../Models/Geolocation';
import { UserMarker } from '../../Models/UserMarker';
import { PathManager } from '../../Models/PathManager';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public map: atlas.Map;
  public userPosition: atlas.data.Position;
  public usersHeading: number = 0;
  public travelMode: boolean = false;

  private _geolocation: Geolocation;
  private _pathManager: PathManager;
  private _userMarker: UserMarker;

  // usersMarker: atlas.HtmlMarker;
  // htmlUserMarker: HTMLElement;
  // defaultOrientation;
  // pathDatasource;
  // datasource: atlas.source.DataSource;
  // path = [[21.957112, 49.643803], [21.952155, 49.643894]];
  // pathLayer: atlas.layer.LineLayer;
  // path: atlas.data.LineString;

  // routeURL: route.RouteURL;


  constructor(geolocation: Geolocation) {
    this._geolocation = geolocation;
  }




  @HostListener('window:deviceorientation', ['$event'])
  onOrientationChange(event) {
    this._geolocation.onHeadingChange(event);
  }


  async ngOnInit() {
    this.map = Configuration.Map();

    this.map.events.add('ready', async () => {
      this._pathManager = new PathManager(this.map);

      const geoData = await this._geolocation.GetMyPosition();
      let coordinates: Coordinates = geoData.coords;
      this.userPosition = new atlas.data.Position(coordinates.longitude, coordinates.latitude);
      this._pathManager.AddPosition(this.userPosition);

      this.map.setCamera(Configuration.Camera(this.userPosition));
      this.map.setTraffic(Configuration.Traffic(false));

      this._userMarker = new UserMarker(this.map, this.userPosition);
      //^^


      this._pathManager.AddPosition([21.957112, 49.643803]); // <<
      this._pathManager.AddPosition([21.952155, 49.643894]); // <<
      this._pathManager.Save();


    });
  }



  toggleTravelMode() {

    this.travelMode = !this.travelMode;
    if (this.travelMode) {
      this.map.setCamera({ pitch: 60, bearing: 90, type: "fly", duration: 400 })
    } else {
      this.map.setCamera({ pitch: 0, bearing: 0, type: "fly", duration: 400 });
    }
  }


}
