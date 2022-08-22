import React, { useRef, useState } from "react";
/* Styles */
import "./App.css";
/* Components */
import { Search } from "./components";
/* Tools */
import Map, { Layer, MapRef, Marker, Popup, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const defaultPolygon = {
  type: "Feature" as const,
  geometry: {
    type: "Polygon" as const,
    coordinates: [
      [
        [-67.13734, 45.13745],
        [-66.96466, 44.8097],
        [-68.03252, 44.3252],
        [-69.06, 43.98],
        [-70.11617, 43.68405],
        [-70.64573, 43.09008],
        [-70.75102, 43.08003],
        [-70.79761, 43.21973],
        [-70.98176, 43.36789],
        [-70.94416, 43.46633],
        [-71.08482, 45.30524],
        [-70.66002, 45.46022],
        [-70.30495, 45.91479],
        [-70.00014, 46.69317],
        [-69.23708, 47.44777],
        [-68.90478, 47.18479],
        [-68.2343, 47.35462],
        [-67.79035, 47.06624],
        [-67.79141, 45.70258],
        [-67.13734, 45.13745],
      ],
    ],
  },
  properties: {},
};

const fillLayer = {
  id: "mainPolygon",
  type: "fill" as const,
  source: "mainPolygon", // reference the data source
  layout: {},
  paint: {
    "fill-color": "#0080ff", // blue color fill
    "fill-opacity": 0.5,
  },
};

function App() {
  const [viewState, setViewState] = React.useState({
    longitude: 8.2275,
    latitude: 46.8182,
    zoom: 8,
  });
  const [selectedBuilding, setSelectedBuilding] = useState<any>();
  const [showPopup, setShowPopup] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const handleBuildingData = (building: any) => {
    setSelectedBuilding(building);

    const { longitude, latitude } = building.coordinates;

    mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
  };

  const getGeomData = () => {
    if (!selectedBuilding || !selectedBuilding.parcelInfo) {
      return defaultPolygon;
    }

    const polygons = selectedBuilding?.parcelInfo?.geom?.coordinates;
    if (!polygons.length) return defaultPolygon;

    // For now only first polygon is used
    const coordinatesAdapted = polygons[0]?.coordinates.map((c: any) => [
      c.longitude,
      c.latitude,
    ]);

    return {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [[...coordinatesAdapted]],
      },
      properties: {},
    };
  };

  return (
    <div className="App">
      <Search handleBuildingData={handleBuildingData} />
      <Map
        {...viewState}
        ref={mapRef}
        onMove={(evt) => setViewState(evt.viewState)}
        initialViewState={{
          longitude: 8.2275,
          latitude: 46.8182,
          zoom: 8,
        }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ""}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {selectedBuilding && (
          <>
            <Marker
              longitude={selectedBuilding.coordinates.longitude}
              latitude={selectedBuilding.coordinates.latitude}
              anchor="bottom"
              onClick={() => setShowPopup(true)}
            >
              <img className="marker" src="/mapbox-icon.png" />
            </Marker>
            <Source id="mainPolygon" type="geojson" data={getGeomData()}>
              <Layer {...fillLayer} />
            </Source>
          </>
        )}
        {selectedBuilding && showPopup && (
          <Popup
            longitude={selectedBuilding.coordinates.longitude}
            latitude={selectedBuilding.coordinates.latitude}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
            className="popup"
            closeOnClick={false}
          >
            <div className="popupContent">
              <div className="popupContentSideBySide">
                <span>Locality:</span>
                <span>{selectedBuilding.locality}</span>
              </div>
              <div className="popupContentSideBySide">
                <span>District:</span>
                <span>{selectedBuilding.district}</span>
              </div>
              <div className="popupContentSideBySide">
                <span>Area:</span>
                <span>{`${selectedBuilding.area} m2`}</span>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default App;
