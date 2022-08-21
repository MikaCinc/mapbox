import React, { useCallback, useEffect, useState } from "react";
/* Styles */
import "./App.css";
/* Components */
import { Search } from "./components";
/* Tools */

/* import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; */

/* const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "",
}); */

function App() {
  return (
    <div className="App">
      <Search />
      {/* <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
      </Map> */}
    </div>
  );
}

export default App;
