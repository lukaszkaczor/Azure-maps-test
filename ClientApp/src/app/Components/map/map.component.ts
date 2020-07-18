import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import * as atlas from 'azure-maps-control';
import * as route from 'azure-maps-rest';
import { Configuration } from '../../Models/Configuration';
import { Geolocation } from '../../Models/Geolocation';
import { UsersPosition, UsersMarker } from '../../Models/UsersMarker';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: atlas.Map;
  usersPosition: atlas.data.Position;
  usersHeading: number = 0;
  usersMarker: atlas.HtmlMarker;
  htmlUserMarker: HTMLElement;
  private _geolocation: Geolocation;
  travelMode: boolean = false;
  defaultOrientation;

  datasource: atlas.source.DataSource;
  path = [[21.957112, 49.643803], [21.952155, 49.643894]];
  pathLayer: atlas.layer.LineLayer;
  tej: atlas.data.LineString;

  routeURL: route.RouteURL;


  constructor(geolocation: Geolocation) {
    this._geolocation = geolocation;
  }




  @HostListener('window:deviceorientation', ['$event'])
  onOrientationChange(event) {
    let result = this._geolocation.onHeadingChange(event);
    // console.log(result);
  }

  def;

  async ngOnInit() {
    this.map = Configuration.Map();

    this.map.events.add('ready', () => {
      this._geolocation.GetMyPosition().then((data) => {
        let coordinates: Coordinates = data.coords;
        this.usersPosition = new atlas.data.Position(coordinates.longitude, coordinates.latitude);
        this.map.setCamera(Configuration.Camera(this.usersPosition));
        this.map.setTraffic(Configuration.Traffic(false));

        this.datasource = new atlas.source.DataSource(); // <<
        this.map.sources.add(this.datasource); // <<
        var pipeline = route.MapsURL.newPipeline(new route.SubscriptionKeyCredential(atlas.getSubscriptionKey()));
        this.routeURL = new route.RouteURL(pipeline);
      }).then(async () => {

        this.DrawPath();


        let ds = new atlas.source.DataSource();
        this.map.sources.add(ds);
        let te = this.map;

        ds.add(new atlas.data.Feature(new atlas.data.Point(this.usersPosition), {
          title: 'Pin_',
        }));

        let sl;

        // await this.drawUsersMarker(te, ds).then(async (data) => {
        //   console.log(data);
        // })
        let userService = new UsersMarker();
        let options = await userService.drawUsersMarker(te, ds);
        console.log(options)
        userService.setOptions();
        console.log(userService.getSymbolLayer())

        // await console.log(this.drawUsersMarker(te, ds));
        // await console.log(this.drawUsersMarker(te, ds));

        // let defaultOptions = symbolLayer.getOptions();
        // defaultOptions.textOptions.haloColor = '#000000'; //Default is actually rgba(0,0,0,0)
      })
    });
  }


  async drawUsersMarker(map, datasource) {

    let symbolLayer: atlas.layer.SymbolLayer;
    let layerOptions: atlas.SymbolLayerOptions;

    await map.imageSprite.createFromTemplate('myTemplatedIcon', 'triangle-arrow-up', 'teal', '#fff').then(function () {
      //Add a symbol layer that uses the custom created icon.
      symbolLayer = new atlas.layer.SymbolLayer(datasource, null, {
        iconOptions: {
          image: 'myTemplatedIcon',
          rotationAlignment: 'map',
          // pitchAlignment: 'viewport'
          // rotation: 90
        }
      })
      map.layers.add(symbolLayer);
      layerOptions = symbolLayer.getOptions();
      // console.log(e)
    })
    return layerOptions;
  }

  // drawUsersMarker(map, ds) {

  //   let symbolLayer: atlas.layer.SymbolLayer;
  //   map.imageSprite.createFromTemplate('myTemplatedIcon', 'triangle-arrow-up', 'teal', '#fff').then(function () {
  //     //Add a symbol layer that uses the custom created icon.
  //     symbolLayer = new atlas.layer.SymbolLayer(ds, null, {
  //       iconOptions: {
  //         image: 'myTemplatedIcon',
  //         rotationAlignment: 'map',
  //         // pitchAlignment: 'viewport'
  //         // rotation: 90
  //       }
  //     })
  //     map.layers.add(symbolLayer);

  //     // return symbolLayer.getOptions();
  //   }).then(() => {

  //     console.log(symbolLayer)
  //   })
  // }

  DrawPath() {
    this.map.events.add('ready', () => {

      this.map.layers.add(new atlas.layer.LineLayer(this.datasource, null, {
        strokeWidth: 5,
        strokeDashArray: [2, 2],
        lineJoin: 'round',
        lineCap: 'round',
        translateAnchor: 'viewport'
      }), 'labels');


      this.snapPointsToRoute();
    });
  }

  snapPointsToRoute() {

    const pipeline = route.MapsURL.newPipeline(new route.SubscriptionKeyCredential(atlas.getSubscriptionKey()));
    this.routeURL = new route.RouteURL(pipeline);

    let coordinates = [this.path[0], this.path[this.path.length - 1]]


    this.routeURL.calculateRouteDirections(route.Aborter.timeout(10000), coordinates).then((directions) => {
      //Get the logical route path as GeoJSON and add it to the data source.
      const data = directions.geojson.getFeatures();
      this.datasource.add(data);

    });
  }



  toggleTravelMode() {
    // this.path.push([21.950535, 49.647485]);
    // this.datasource.add(this.tej);
    console.log(this.usersPosition)

    // this.pathLayer.
    this.travelMode = !this.travelMode;
    if (this.travelMode) {
      this.map.setCamera({ pitch: 60, bearing: 90, type: "fly", duration: 400 })
      // this.htmlUserMarker.style.transform = `rotate(-90deg)`;

    } else {
      this.map.setCamera({ pitch: 0, bearing: 0, type: "fly", duration: 400 });
    }
  }


}
