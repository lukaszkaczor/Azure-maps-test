import { Component, OnInit, AfterViewInit, HostListener, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
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

  headingAdjustment = - 90;
  heading;
  flag = false;



  constructor(geolocation: Geolocation) {
    this._geolocation = geolocation;
  }




  @HostListener('window:deviceorientation', ['$event'])
  onOrientationChange(event) {

    if (this.flag) {
      let result = this._geolocation.onHeadingChange(event);

      this.heading = result += this.headingAdjustment;

      this._userMarker.SetLayerOptions({ iconOptions: { rotation: this.heading } })
      // alert(result);
    }

    if (this.travelMode) {
      // this.map.setCamera({ bearing: this.heading })
      this.map.setCamera({ pitch: 60, bearing: this.heading })

    }



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
      await this._userMarker.Init();
      //^^
      this.flag = true;

      // this._pathManager.AddPosition([21.957112, 49.643803]); // <<
      // this._pathManager.AddPosition([21.952155, 49.643894]); // <<
      // this._pathManager.Save();

      navigator.geolocation.watchPosition((data) => {
        coordinates = data.coords;
        this.userPosition = new atlas.data.Position(coordinates.longitude, coordinates.latitude);
        // this._userMarker.

        this._pathManager.AddPositionAndSave(this.userPosition);

        this._userMarker.SetMarkerPosition(this.userPosition);

        // }, null, { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 })
      }, null, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 })

      // this._userMarker.SetLayerOptions({ iconOptions: { rotation: 90 } })

    });
  }



  toggleTravelMode() {
    // this.tak();
    // this._userMarker.SetMarkerPosition(this.userPosition);

    const duration = 400;

    if (!this.travelMode) {
      this.map.setCamera({ pitch: 60, bearing: this.heading, type: "fly", duration: duration })
      setTimeout(() => {
        this.travelMode = !this.travelMode;
      }, 400);

    } else {
      this.map.setCamera({ pitch: 0, bearing: 0, type: "fly", duration: duration });

      this.travelMode = !this.travelMode;
    }


  }
}
