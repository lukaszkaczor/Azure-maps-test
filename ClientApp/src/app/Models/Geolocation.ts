

export class Geolocation {
    defaultOrientation;
    usersHeading;

    public GetMyPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    public WatchMyPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.watchPosition(resolve, reject);
        });
    }

    getBrowserOrientation() {
        var orientation;
        if (screen.orientation && screen.orientation.type) {
            orientation = screen.orientation.type;
        } else {
            orientation = screen.orientation //||
            // screen.mozOrientation ||
            // screen.msOrientation;
        }
        return orientation;
    }

    // called on device orientation change
    onHeadingChange(event) {
        var heading = event.alpha;

        if (typeof event.webkitCompassHeading !== "undefined") {
            heading = event.webkitCompassHeading; //iOS non-standard
        }

        var orientation = this.getBrowserOrientation();

        if (typeof heading !== "undefined" && heading !== null) { // && typeof orientation !== "undefined") {
            // we have a browser that reports device heading and orientation


            // what adjustment we have to add to rotation to allow for current device orientation
            var adjustment = 0;
            if (this.defaultOrientation === "landscape") {
                adjustment -= 90;
            }

            if (typeof orientation !== "undefined") {
                var currentOrientation = orientation.split("-");

                if (this.defaultOrientation !== currentOrientation[0]) {
                    if (this.defaultOrientation === "landscape") {
                        adjustment -= 270;
                    } else {
                        adjustment -= 90;
                    }
                }

                if (currentOrientation[1] === "secondary") {
                    adjustment -= 180;
                }
            }

            // this.currentPosition.hng = heading + adjustment;
            this.usersHeading = heading + adjustment;

            var phase = this.usersHeading < 0 ? 360 + this.usersHeading : this.usersHeading;
            // var phase = this.currentPosition.hng < 0 ? 360 + this.currentPosition.hng : this.currentPosition.hng;
            // // this.positionHng.textContent = (360 - phase) + "°";
            // // this.positionHng.textContent = (360 - phase | 0) + "°";
            // this.userMarker.setIcon(Icons.User((360 - phase | 0)));
            // // this.userMarker.setPosition(this.usersPosition);
            this.usersHeading = 360 - phase;
        } else {
            // this.userMarker.setIcon(Icons.User(0));
            this.usersHeading = 0;

        }
        console.log(this.usersHeading);
        return this.usersHeading;
    }
}