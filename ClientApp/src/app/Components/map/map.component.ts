import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import * as atlas from 'azure-maps-control';
import * as route from 'azure-maps-rest';
import { Configuration } from '../../Models/Configuration';
import { Geolocation } from '../../Models/Geolocation';
import { HTMLElements } from '../../Models/HTMLElements';



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
      }).then(() => {

        this.DrawPath();

        // this.datasource = new atlas.source.DataSource();
        console.log("tak")

        let ds = new atlas.source.DataSource();
        this.map.sources.add(ds);
        let te = this.map;

        ds.add(new atlas.data.Feature(new atlas.data.Point(this.usersPosition), {
          title: 'Pin_',
        }));

        let sl;

        te.imageSprite.createFromTemplate('myTemplatedIcon', 'triangle-arrow-up', 'teal', '#fff').then(function () {

          //Add a symbol layer that uses the custom created icon.
          sl = new atlas.layer.SymbolLayer(ds, null, {
            iconOptions: {
              image: 'myTemplatedIcon',
              rotationAlignment: 'map'
            }
          })
          te.layers.add(sl);
        }).then(() => {
          console.log(sl)

        });

        // ds.add()
        // ds.add()


        // let symbolLayer = new atlas.layer.SymbolLayer(ds, null, {
        //   iconOptions: {
        //     rotationAlignment: 'map',
        //     pitchAlignment: 'viewport',
        //     anchor: 'center'
        //   }
        // });
        // this.map.layers.add(symbolLayer);

        // let defaultOptions = symbolLayer.getOptions();
        // defaultOptions.textOptions.haloColor = '#000000'; //Default is actually rgba(0,0,0,0)

      });
    });
  }


  DrawPath() {
    this.map.events.add('ready', () => {
      // this.datasource = new atlas.source.DataSource();
      // this.map.sources.add(this.datasource);

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

      //Update the map view to center over the route.
      // this.map.setCamera({
      //   bounds: data.bbox,
      //   padding: 30 //Add a padding to account for the pixel size of symbols.
      // });
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

  // addLocation() {
  //   this.path.push([21.950535, 49.647485]);
  //   this.snapPointsToRoute();
  // }

}
