const ArcGISPlugin = require("@arcgis/webpack-plugin");
/**
 * Configuration items defined here will be appended to the end of the existing webpack config defined by the Angular CLI.
 */
module.exports = {
  plugins: [new ArcGISPlugin({
    locales: ["lt"],
    features: {
        "3d": false
    },
    // exclude modules
    userDefinedExcludes: [
        "arcgis-js-api/layers/BingMapsLayer",
        "arcgis-js-api/layers/CSVLayer",
        "arcgis-js-api/layers/GeoRSSLayer",
        "arcgis-js-api/layers/ImageryLayer",
        "arcgis-js-api/layers/KMLLayer",
        "arcgis-js-api/layers/OpenStreetMapLayer",
        "arcgis-js-api/layers/WMSLayer",
        "arcgis-js-api/layers/WMTSLayer",
        "arcgis-js-api/layers/WebTileLayer"
      ]
  })],
  externals: {
    moment: 'moment'
  },
  node: {
    process: false,
    global: false,
    fs: "empty"
  }
};
