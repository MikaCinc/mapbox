import React, { useCallback, useEffect, useState } from "react";
/* Styles */
import "./App.css";
/* Components */
import { Search } from "./components";
import { ISearchOption } from "./interfaces";
/* Tools */
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState<any>();
  const [showPopup, setShowPopup] = useState(false);

  const handleBuildingData = (building: any) => {
    console.log("handleBuildingData", building);
    setSelectedBuilding(building);
  };

  return (
    <div className="App">
      <Search handleBuildingData={handleBuildingData} />
      <Map
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
          <Marker
            longitude={selectedBuilding.coordinates.longitude}
            latitude={selectedBuilding.coordinates.latitude}
            anchor="bottom"
            onClick={() => {
              console.log("onClick");

              setShowPopup(true);
            }}
          >
            <img className="marker" src="/mapbox-icon.png" />
          </Marker>
        )}
        {selectedBuilding && showPopup && (
          <Popup
            longitude={selectedBuilding.coordinates.longitude}
            latitude={selectedBuilding.coordinates.latitude}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
            onOpen={() => console.log("onOpen")}
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
