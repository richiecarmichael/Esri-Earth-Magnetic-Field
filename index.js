/*    
    Copyright 2016 Esri

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

require({
    packages: [{
        name: 'app',
        location: document.location.pathname + '/..'
    }]
}, [
    'esri/Map',
    'esri/Camera',
    'esri/views/SceneView',
    'esri/views/3d/externalRenderers',
    'app/js/wave',
    'dojo/domReady!'
],
function (
    Map,
    Camera,
    SceneView,
    ExternalRenderers,
    Wave
    ) {
    // Enforce strict mode
    'use strict';

    //
    var LAT = 0;
    var LONG = 0;
    var ALT = 100000000;
    var _wave = null;

    // Create map and view
    var _view = new SceneView({
        map: new Map({
            basemap: 'satellite'
        }),
        container: 'map',
        ui: {
            components: []
        },
        environment: {
            lighting: {
                directShadowsEnabled: false,
                ambientOcclusionEnabled: false,
                cameraTrackingEnabled: false
            },
            atmosphereEnabled: true,
            atmosphere: {
                quality: 'high'
            },
            starsEnabled: true
        },
        constraints: {
            altitude: {
                min: ALT,
                max: ALT
            }
        }
    });
    _view.then(function () {
        // Set initial camera position
        _view.set('camera', Camera.fromJSON({
            'position': {
                'x': LONG,
                'y': LAT,
                'spatialReference': {
                    'wkid': 4326
                },
                'z': ALT
            }
        }));

        // Increase far clipping plane
        _view.constraints.clipDistance.far *= 2;

        // Load wave layer
        loadWaves()
    });

    //
    function loadWaves() {
        // Remove old renderer
        if (_wave) {
            ExternalRenderers.remove(_view, _wave);
        }

        // Create external renderer
        _wave = new Wave(_view, LONG, LAT, ALT);

        // Add renderer
        ExternalRenderers.add(
            _view,
            _wave
        );
    }
});
