import { StreamConfig } from "../models/stream-config.model";
import { environment } from "../../../environments/environment";

if (environment.mapsdev) {
  console.log("%c MapsDev", "color: green; font-weight:bold", environment);
}

export const CONFIG = {
  defaultTitle: "Vilniaus miesto interaktyvūs žemėlapiai",
  mapOptions: {
    options: {
      extent: {
        xmin: 555444.210800001,
        ymin: 6051736.22,
        xmax: 606967.016199999,
        ymax: 6076388.28,
        spatialReference: {
          wkid: 3346,
        },
      },
    },
    staticServices: {
      // for basemaps const check basemaps.ts in map-widgets folder
      basemapUrl:
        "https://gis.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/Vilnius_basemap_LKS_su_rajonu/MapServer",
      basemapDarkUrl:
        "https://gis.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/Vilnius_basemap_dark_calibrated/MapServer",
      ortofotoUrl:
        "https://opencity.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/ORTO_2022_LKS/MapServer",
      // ortofotoDetailed19Url:
      // "https://opencity.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/ORTO_2019_LKS/MapServer",
      ortofotoFull19Url:
        "https://opencity.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/ORTO_2019_LKS_FULL/MapServer",
      // basemapEngineeringUrl:
      //   "https://gis.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/Vilnius_Inzinerija/MapServer",
      // geometryUrl:
      //   "https://gis.vplanas.lt/arcgis/rest/services/Utilities/Geometry/GeometryServer",
      // tslint:disable-next-line: max-line-length
      //  printServiceUrl: "https://zemelapiai.vplanas.lt/arcgis/rest/services/ITV_teritorijos/ITV_teritorijos_spausdinimas/GPServer/Export%20Web%20Map"
      // tslint:disable-next-line: max-line-length
      printServiceUrl:
        "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Interaktyvus_Default/GPServer/Export%20Web%20Map",
      extract3DGP: {
        url: "https://atviras.vplanas.lt/arcgis/rest/services/Geoprocesingai/3DEXPORT_LIMITED/GPServer/3D_OBJ_GP_su_PIKET_LIMIT",
        params: {
          // Geoprocessor input name of the service
          name: "Teritorija",
        },
      },
      extractDWG: {
        url: "https://atviras.vplanas.lt/arcgis/rest/services/Geoprocesingai/fgdbDwgZipLimited/GPServer/fgdbDwgZipLimited",
        params: {
          name: "Input_Area",
        },
        limitsFrontEnd: 2.1, // limited size, backend has same limits
        title: "Atsisiųsti topografijos FGDB / DWG fragmentą:",
        message: "Atsisiųskite fgdb arba dwg ištraukas zip formatu:",
        icon: "esri-icon-layers",
        aproxExtractTime: 10,
        zipFiles: {
          zip1: {
            name: "FGDB_zip",
            title: "GDB",
          },

          zip2: {
            name: "DWG_zip",
            title: "DWG",
          },
        },
      },
      extractDWGTech: {
        url: "https://atviras.vplanas.lt/arcgis/rest/services/Geoprocesingai/fgdbDwgZipLimitedTechP/GPServer/fgdbDwgZipLimitedTechP",
        params: {
          name: "Input_area",
        },
        limitsFrontEnd: 4.1, // limited size, backend has same limits
        title: "Atsisiųsti techninių projektų DWG fragmentą:",
        message:
          "Atsisiųskite patvirtinų arba rengiamų projektų dwg ištraukas zip formatu:",
        icon: "esri-icon-maps",
        aproxExtractTime: 2,
        zipFiles: {
          zip1: {
            name: "DWG_Patvirtinti_Zip",
            title: "Patvirtinti",
          },
          zip2: {
            name: "DWG_Rengiami_Zip",
            title: "Rengiami",
          },
        },
      },
      profileGP: {
        url: "https://atviras.vplanas.lt/arcgis/rest/services/Geoprocesingai/Profile/GPServer/Profile",
        params: {
          name: "InputLineFeatures",
        },
      },
      // allLayers group service for displaying all layers
      commonMaps:
        "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Bendras_optimized/MapServer",
    },
  },
  themes: {
    teritory: {
      production: true, // if theme is ready for production
      name: "Planavimas ir statyba", // theme name
      // id: "teritory-planning", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Teritorijų planavimo ir statybų temoje rasite informaciją apie šių sluoksnių grupes: kaimynijos, bendrasis planas, teritorijų planavimo registras, hidrantai, detalieji planai, koncepcijos, gatvių kategorijos, raudonosios linijos, leidimai statyti, inžineriniai projektai, specialūs planai, nomenklatūra, gyventojų tankumas, projektinės seniūnaitijų ribos",
      id: "teritoriju-planavimas", // theme id class and theme URL query name
      imgUrl: "assets/img/teritorijos.png", // image URL
      imgAlt: "Teritorijų planavimas", // image alt attribute
      layers: {
        teritorijuPlanavimas: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Teritoriju_planavimas/MapServer",
          name: "Teritorijų planavimas ir statyba:",
          isGroupService: true,
          opacity: 0.9,
        },
      },
    },
    general_plan: {
      production: true, // if theme is ready for production
      name: "Bendrasis planas 2021", // theme name
      // id: "teritory-planning", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Bendrojo plano temoje rasite informaciją apie 2021m. Vilniaus mieste priimtą bendrąjį planą: rajonų ribas, užstatymo intensyvumus, užstatymo vyraujaunačius aukščius, planuojamus užstatymo tipus, informacija apie ribojimus sklypuose ir infrastruktūros plėtra",
      id: "bendrasis-planas", // theme id class and theme URL query name
      imgUrl: "assets/img/BP_1.png", // image URL
      imgAlt: "Bendrasis planas", // image alt attribute
      layers: {
        bendrasisPlanas: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Bendrasis_planas_2021/MapServer",
          name: "Bendrasis planas 2021",
          isGroupService: true,
          opacity: 0.9,
        },
      },
    },
    TeritoryMaintenance: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=teritory-maintenance",
      production: true, // if theme is ready for production
      name: "Miesto tvarkymas", // theme name
      // id: "teritory-maintenance", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Miesto tvarkymo temoje rasite informaciją apie šių sluoksnių grupes: gatvių priežūra, gatvių ir pėsčiųjų takų tvarkymo darbai, tvarkomos miesto teritorijos, medžių inventorizacija, atliekų tvarkymas",
      id: "miesto-tvarkymas", // theme id class and theme URL query name
      imgUrl: "assets/img/miesto-tvarkymas.png", // image URL
      imgAlt: "Miesto tvarkymas", // image alt attribute
      layers: {
        miestoTvarkymas: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Miesto_tvarkymas/MapServer",
          name: "Miesto tvarkymas:", // dynamicLayers group name
          opacity: 0.6,
          isGroupService: true,
          // TODO add gallery feature
          gallery: false,
        },
        vilniausVandenys: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vv.lt/arcgis/rest/services/Public/Avarijos_public/MapServer",
          opacity: 0.8,
          visible: true,
          name: "Vandentiekio ir nuotekų tinklo avarijos:", // dynamicLayers group name
        },
        sisp: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://arcgis.sisp.lt/arcgis/rest/services/VT_tinklas_atnaujintas/MapServer",
          opacity: 0.8,
          name: "Viešojo transporto maršrutai (SĮSP):", // dynamicLayers group name
        },
      },
      streamLayers: {
        grindaStream: {
          url: "https://geoevent.vilnius.lt/arcgis/rest/services/stream-service-out_GRINDA_LKS/StreamServer",
          visible: false,
          title: "UAB Grinda automobilių parko stebėjimas",
          setRotation: true,
          rotationAttribute: "direction",
          labelFeatures: ["plate"],
        } as StreamConfig,
      },
    },
    teritoryReturn: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=teritory-return",
      production: true, // if theme is ready for production
      name: "Žemės grąžinimas", // theme name
      // id: "teritory-return", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Teritorijų grąžinimo temoje rasite informaciją apie valstybinius žemės plotus, žemės gražinimą /atkūrimą, specialiuosius planus",
      id: "zemes-grazinimas", // theme id class and theme URL query name
      imgUrl: "assets/img/zeme.png", // image URL
      imgAlt: "Teritorijų grąžinimas", // image alt attribute
      layers: {
        teritorijuGrazinimas: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Zemes_grazinimas/MapServer",
          name: "Teritorijų grąžinimas:",
          isGroupService: true,
        },
      },
    },
    environment: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=env",
      production: true, // if theme is ready for production
      name: "Aplinkosauga", // theme name
      // id: "env", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Aplinkosaugos temoje rasite informaciją apie šių sluoksnių grupes: triukšmo sklaida, tyliosios triukšmo ir prevencinės zonos, oro tarša, dugno nuosėdos, paviršinio vandens tarša, uždarytų savartynų tarša",
      id: "aplinkosauga", // theme id class and theme URL query name
      imgUrl: "assets/img/aplinkosauga.png", // image URL
      imgAlt: "Aplinkosauga", // image alt attribute
      layers: {
        aplinkosauga: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Aplinkosauga/MapServer",
          name: "Aplinkosauginiai sluoksniai:", // dynamicLayers group name
          opacity: 0.7,
          isGroupService: true, // if layers has grouping in mxd / value for administration purpose only
        },
      },
    },
    cyclingTracks: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=cycling-tracks",
      production: true, // if theme is ready for production
      name: "Transportas / Dviračiai", // theme name
      // id: "cycling-tracks", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Transporto temoje rasite informaciją apie rinkliavos zonas, kiss and ride stoteles, vaizdo stebėsenos vietas, viešąjį transportą, dviračių trasas, eismo įvykius, juodąsias dėmes",
      id: "transportas", // theme id class and theme URL query name
      imgUrl: "assets/img/dviraciai.png", // image URL
      imgAlt: "Transportas / Dviračiai", // image alt attribute
      layers: {
        // accidentsRaster: { // layer unique name //
        //   dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
        //   "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Eismo_ivykiu_tankumas/MapServer",
        //   name: "Eismo įvykių tankumas", // dynamicLayers group name
        //   opacity: 0.7,
        //   isRaster: true //is layer Ratser , do not identify layer if true / default value is false
        // },
        transportas: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Transportas/MapServer",
          name: "Transportas / Dviračiai:", // dynamicLayers group name
          opacity: 0.9,
        },
        sisp: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://arcgis.sisp.lt/arcgis/rest/services/VT_tinklas_atnaujintas/MapServer",
          opacity: 0.8,
          name: "Viešojo transporto maršrutai (SĮSP):", // dynamicLayers group name
        },
      },
      streamLayers: {
        vvtStream: {
          url: "https://geoevent.vilnius.lt/arcgis/rest/services/stream-service-out_VIESASIS_TRANSPORTAS_AG/StreamServer",
          visible: false,
          title: "Viešojo transporto stebėjimas",
          setRotation: true,
          rotationAttribute: "angle",
          labelFeatures: ["trType", "label"],
          stops: {
            type: "color",
            field: "trCode",
            valueExpression: "Number($feature.trCode)",
            valueExpressionTitle: "Legenda",
            legendOptions: { showLegend: false },
            stops: [
              // API 13 : value must be number
              { value: 1, color: "#e61d25", label: "Troleibusai" },
              { value: 2, color: "#05629f", label: "Autobusai" },
            ],
          },
          renderer: {
            type: "unique-value", // autocasts as new UniqueValueRenderer()
            field: "trCode",
            legendOptions: {
              title: " ", // leave empty legend title
            },
            defaultLabel: "-",
            defaultSymbol: { type: "simple-fill" }, // autocasts as new SimpleFillSymbol()
            uniqueValueInfos: [
              {
                // All features with value of "North" will be blue
                value: "1",
                label: "Troleibusai",
                symbol: {
                  type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                  // style, // not using style, using path instead
                  // use an SVG path to create an arrow shape
                  // tslint:disable-next-line: max-line-length
                  path: "M54.15199047330047,1.621444913480601 C36.122233905216476,1.621444913480601 21.505981653418786,16.23769716527829 21.505981653418786,34.26745373336229 C21.505981653418786,52.29742629134226 43.94538793811259,94.34698721310683 54.15199047330047,94.34698721310683 S86.79799929318216,52.29721030144628 86.79799929318216,34.26745373336229 C86.79799929318216,16.23769716527829 72.18174704138447,1.621444913480601 54.15199047330047,1.621444913480601",
                  color: "#e61d25",
                  outline: {
                    color: [255, 255, 255, 0.7],
                    width: 0.5,
                  },
                  // since the arrow points down, you can set the angle to 180
                  // to force it to point up (0 degrees North) by default
                  angle: 180,
                  size: 15,
                },
              },
              {
                // All features with value of "North" will be blue
                value: "2",
                label: "Autobusai",
                symbol: {
                  type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                  // style, // not using style, using path instead
                  // use an SVG path to create an arrow shape
                  // tslint:disable-next-line: max-line-length
                  path: "M54.15199047330047,1.621444913480601 C36.122233905216476,1.621444913480601 21.505981653418786,16.23769716527829 21.505981653418786,34.26745373336229 C21.505981653418786,52.29742629134226 43.94538793811259,94.34698721310683 54.15199047330047,94.34698721310683 S86.79799929318216,52.29721030144628 86.79799929318216,34.26745373336229 C86.79799929318216,16.23769716527829 72.18174704138447,1.621444913480601 54.15199047330047,1.621444913480601",
                  color: "#05629f",
                  outline: {
                    color: [255, 255, 255, 0.7],
                    width: 0.5,
                  },
                  // since the arrow points down, you can set the angle to 180
                  // to force it to point up (0 degrees North) by default
                  angle: 180,
                  size: 15,
                },
              },
            ],
            visualVariables: [
              {
                type: "rotation", // indicates that symbols should be rotated based on value in field
                field: "angle", // field containing aspect values
                rotationType: "geographic",
              },
            ],
          },
        } as StreamConfig,
      },
    },
    leisure: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=laisvalaikis",
      production: true, // if theme is ready for production
      name: "Laisvalaikis", // theme name
      description:
        "Laisvalaikio temoje rasite informaciją apie atviras sales, viešuosius tualetus, jaunimo veiklą, pėsčiųjų trasas",
      id: "laisvalaikis", // theme id class and theme URL query name
      imgUrl: "assets/img/laisvalaikis.png", // image URL
      imgAlt: "Laisvalaikis", // image alt attribute
      layers: {
        laisvalaikis: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Laisvalaikis/MapServer",
          name: "Laisvalaikis", // dynamicLayers group name
        },
      },
    },
    green_vilnius: {
      production: true, // if theme is ready for production
      name: "Žaliasis Vilnius", // theme name
      description:
        "Žaliasis Vilnius temoje rasite informaciją susijusią su Vilniaus miesto želdynais, apsodinimu ir planuojamais sodinimais",
      id: "zaliasis_vilnius", // theme id class and theme URL query name
      imgUrl: "assets/img/med.png", // image URL
      imgAlt: "Žaliasis Vilnius", // image alt attribute
      layers: {
        laisvalaikis: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Zalias_Vilnius/MapServer",
          name: "Žaliasis Vilnius", // dynamicLayers group name
        },
      },
    },
    publicCaffes: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=caffee",
      production: true, // if theme is ready for production
      name: "Lauko kavinės", // theme name
      // id: "caffee", //theme id class and theme URL query name
      description:
        "Lauko kavinių temoje rasite informaciją apie lauko kavines Vilniuje, jų užimamus plotus, leidimus",
      id: "kavines", // theme id class and theme URL query name
      imgUrl: "assets/img/kavines.png", // image URL
      imgAlt: "Lauko kavinės", // image alt attribute
      layers: {
        publicCaf: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/lauko_kavines/MapServer",
          name: "Lauko kavinės", // dynamicLayers group name
        },
      },
    },
    publicKiosks: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=caffee",
      production: true, // if theme is ready for production
      name: "Kioskai", // theme name
      // id: "caffee", //theme id class and theme URL query name
      description:
        "Kioskų temoje rasite informaciją apie kioskus Vilniuje, jų užimamus plotus, leidimus",
      id: "kioskai", // theme id class and theme URL query name
      imgUrl: "assets/img/kiosk.png", // image URL
      imgAlt: "Kioskai", // image alt attribute
      layers: {
        publicKiosk: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Kioskai/MapServer",
          name: "Kioskai", // dynamicLayers group name
        },
      },
    },
    civilSecurity: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true, // if theme is ready for production
      name: "Civilinė sauga", // theme name
      // id: "civ-sauga", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Civilinės saugos temoje rasite informaciją apie gyventojų perspėjimo sirenas, kolektyvinės apsaugos statinius, gyventojų evakuavimo punktus, vandentiekio ir nuotekų tinklo avarijas",
      id: "civiline-sauga", // theme id class and theme URL query name
      imgUrl: "assets/img/civiline-sauga.png", // image URL
      imgAlt: "Civilinė sauga", // image alt attribute
      layers: {
        civilFacility: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Civiline_sauga/MapServer",
          opacity: 0.8,
          name: "Civilinė sauga", // dynamicLayers group name
        },
      },
    },
    elderships: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=seniunijos",
      production: true, // if theme is ready for production
      name: "Seniūnijos", // theme name
      // id: "civ-sauga", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Seniūnijų temoje rasite informaciją apie seniūnijų ribas, būstines, seniūnaitijas, kaimynijas, planuojamus miesto tvarkymo darbų",
      id: "seniunijos", // theme id class and theme URL query name
      imgUrl: "assets/img/seniunijos.png", // image URL
      imgAlt: "Seniūnijos", // image alt attribute
      layers: {
        elderships: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Seniunijos/MapServer",
          opacity: 1,
          name: "Seniūnijos", // dynamicLayers group name
        },
      },
    },
    socialServices: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=socialines-paslaugos",
      production: true, // if theme is ready for production
      name: "Socialinės paslaugos", // theme name
      // id: "civ-sauga", //theme id class and theme URL query name
      description:
        "Socialinių paslaugų temoje rasite informaciją apie socialine paslaugas teikiančias įstaigas",
      id: "socialines-paslaugos", // theme id class and theme URL query name
      imgUrl: "assets/img/soc-paslaugos.png", // image URL
      imgAlt: "Socialinės paslaugos", // image alt attribute
      layers: {
        socialLayer: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Socialines_paslaugos/MapServer",
          opacity: 1,
          name: "Socialinės paslaugos", // dynamicLayers group name
        },
      },
    },
    safeCity: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=saugus-miestas",
      production: true, // if theme is ready for production
      name: "Saugus miestas", // theme name
      // id: "civ-sauga", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Saugaus miesto temoje rasite informaciją apie vaizdo stebėjimo kameras, bešeimininkių kačių kastravimo programų vykdymą",
      id: "saugus-miestas", // theme id class and theme URL query name
      imgUrl: "assets/img/saugus-miestas.png", // image URL
      imgAlt: "Saugus miestas", // image alt attribute
      layers: {
        safeCityLayer: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Saugus_miestas/MapServer",
          opacity: 1,
          name: "Saugus miestas", // dynamicLayers group name
        },
      },
    },
    votingPlaces: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=laisvalaikis",
      production: true, // if theme is ready for production
      name: "Rinkimai", // theme name
      description:
        "Rinkimų temoje rasite aktualią informaciją apie rinkimų apylinkes, apygardas ir balsavimo vietas Vilniaus mieste",
      id: "rinkimai", // theme id class and theme URL query name
      imgUrl: "assets/img/bals-aps.png", // image URL
      imgAlt: "Rinkimai", // image alt attribute
      layers: {
        laisvalaikis: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Rinkimai/MapServer",
          name: "Rinkimų tema", // dynamicLayers group name
        },
      },
    },
    iotTheme: {
      production: "production", // if theme is ready for production
      hide: true,
      name: "Daiktų internetas", // theme name
      // id: "daiktu-internetas", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Daiktų interneto temoje rasite informaciją apie mieste esančių įvairių daviklių pateikiamą informaciją",
      id: "daiktu-internetas", // theme id class and theme URL query name
      imgUrl: "assets/img/daiktu-internetas.png", // image URL
      imgAlt: "Daiktų internetas", // image alt attribute
      layers: {
        intelMeasureLayer: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Intelektualus_matavimas/MapServer",
          opacity: 1,
          name: "Intelektualus matavimas", // dynamicLayers group name
        },
        surveilenceLayer: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Daiktu_internetas/MapServer",
          opacity: 1,
          name: "Intelektualus vaizdo stebėjimas", // dynamicLayers group name
        },
      },
    },
    odlTownProjects: {
      production: "production", // if theme is ready for production
      hide: true, // hide from themes menu, but add route with functionality
      name: "Senamiesčio projektai", // theme name
      // id: "civ-sauga", //theme id class and theme URL query name
      description: "Senamiesčio projektai",
      id: "senamiescio-projektai", // theme id class and theme URL query name
      imgUrl: "assets/img/ptakai.png", // image URL
      imgAlt: "Senamiesčio projektai", // image alt attribute,
      zoomLevel: 4,
      zoomCoords: [583035.2149091947, 6061202.102446364],
      layers: {
        oldTownLayer: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/TESTAVIMAI/maps_vilnius_kilpos/MapServer",
          opacity: 1,
          name: "Senamiesčio projektai",
        },
      },
    },
    propertyUnits: {
      production: !environment.production || environment.mapsdev, // if theme is ready for production
      name: "Savivaldybės turtas", // theme name
      // id: "civ-sauga", //theme id class and theme URL query name
      description: "Savivaldybės turtas",
      id: "savivaldybes-turtas", // theme id class and theme URL query name
      imgUrl: "assets/img/projektai.png", // image URL
      imgAlt: "Savivaldybės turtas", // image alt attribute,
      zoomLevel: 4,
      zoomCoords: [583035.2149091947, 6061202.102446364],
      layers: {
        propUnitsLayer: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Savivaldybes_turtas/MapServer",
          opacity: 1,
          name: "Savivaldybės turtas",
        },
      },
    },
    culturalHeritage: {
      production: true, // if theme is ready for production
      name: "Kultūros paveldas", // theme name
      description: "Kultūros paveldas",
      id: "kulturos_paveldas", // theme id class and theme URL query name
      imgUrl: "assets/img/paveldas.png", // image URL
      imgAlt: "Kultūros Paveldas", // image alt attribute
      layers: {
        paveldas: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Paveldas/MapServer",
          name: "Kultūros paveldas", // dynamicLayers group name
        },
      },
    },
    quarterlyRenovation: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      custom: true, // true if theme funcionality is custom
      production: false, // if theme is ready for production
      name: "Kvartalinė renovacija", // theme name
      // id: "civ-sauga", //theme id class and theme URL query name
      description:
        "Kvartalinės renovacijos temoje rasite informaciją apie Vilniaus miesto kvartalų palyginimą įvairiais pjūviais",
      id: "kvartaline-renovacija", // theme id class and theme URL query name
      imgUrl: "assets/img/kvart-renovacija.png", // image URL
      imgAlt: "Kvartalinė renovacija", // image alt attribute
      layers: {
        quarters: {
          // layer unique name //
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Kvartaline_renovacija/MapServer",
          opacity: 1,
          name: "Vilniaus miesto kvartalai", // dynamicLayers group name
        },
      },
    },
    buildings: {
      production: true, // if theme is ready for production
      custom: true, // true if theme funcionality is custom
      name: "Kvartalinė renovacija", // theme name
      // tslint:disable-next-line: max-line-length
      description:
        "Gyvenamųjų pastatų šilumo suvartojimo informacija, energetinis efektyvumas, faktinio energijos suvartojimo klasės, mėnesiniai šilumos suvartojimai pagal mokėjimus už šilumą", // meta description
      // id: "theme-buildings", //theme id class and theme URL query name
      id: "pastatai", // theme id class and theme URL query name
      imgUrl: "assets/img/pastatai.png", // image URL
      imgAlt: "Šilumos suvartojimas", // image alt attribute
      layers: {
        // quarters: { // layer unique name //
        //   dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
        //     "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Kvartaline_renovacija/MapServer",
        //   opacity: 1,
        //   name: "Vilniaus miesto kvartalai" // dynamicLayers group name
        // },
        silumosSuvartojimas: {
          // layer unique name
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Pastatai_statyba_kvartalai/MapServer",
          name: "Pastatai",
        },
      },
    },
    itvTheme: {
      production: true, // if theme is ready for production
      version: "arcgis4",
      hide: false, // hide from themes menu, but add route with functionality
      custom: true,
      name: "Investiciniai projektai", // theme name
      // tslint:disable-next-line: max-line-length
      description:
        "Interaktyvus investicinių projektų žemėlapis yra skirtas Vilniaus gyventojams ir miesto svečiams patogiai ir išsamiai susipažinti su naujausia informacija apie mieste planuojamus, vykdomus ir jau įgyvendintus investicinius projektus",
      id: "projektai", // theme id class and theme URL query name
      imgUrl: "assets/img/projektai.png", // image URL
      imgAlt: "Investiciniai projektai", // image alt attribute
      info: "Uses static menu legend", // Meta info about project
      layers: {
        // maps layers for scaling on map
        mapLayer:
          "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/itv_projects_GDB/MapServer",
        // all projects (converted to polygon) for listing
        uniqueProjects:
          "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/itv_projects_common_GDB/MapServer",
        // 2 base teritories south and north
        teritories:
          "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/itv_teritories/MapServer",
        // identify map service
        identifyLayer:
          "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/ITV_bendri/MapServer",
        name: "Investiciniai projektai",
      },
    },
    kindergartens: {
      production: true, // if theme is ready for production
      custom: true, // true if theme funcionality is custom
      name: "Darželiai", // theme name
      // id: "theme-buildings", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Ikimokyklinių ugdymo įstaigų (darželių, privačių darželių, kitų įstaigų) paieška pagal gyvenamąjį adresą, tipą, kalbą ar grupės amžių",
      id: "darzeliai", // theme id class and theme URL query name
      imgUrl: "assets/img/darzeliai.png", // image URL
      imgAlt: "Darželiai", // image alt attribute
      layers: {
        darzeliai: {
          // layer unique name
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Darzeliai/MapServer",
          name: "Darželiai",
        },
      },
    },
    waist: {
      production: !environment.production || environment.mapsdev,
      custom: true, // true if theme funcionality is custom
      name: "Atliekų tvarkymas", // theme name
      // id: "theme-buildings", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Atliekų tvarkymo temoje  rasite informaciją apie atliekų išvežimo taškus, grafikus, vėlavimus ir kitą statistinę informaciją",
      id: "atlieku-tvarkymas", // theme id class and theme URL query name
      imgUrl: "assets/img/darzeliai.png", // image URL
      imgAlt: "Atliekų tvarkymas", // image alt attribute
      layers: {
        atliekos: {
          // layer unique name
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://atviras.vplanas.lt/arcgis/rest/services/Testavimai/Konteineriu_pakelimai/MapServer",
          name: "Atliekų tvarkymas",
        },
      },
    },
    buildingsAdministration: {
      url: "https://maps.vilnius.lt/maps_vilnius/?theme=theme-buildings",
      external: true,
      production: true, // if theme is ready for production
      custom: true, // true if theme funcionality is custom
      name: "Pastatų administravimas", // theme name
      // id: "theme-buildings", //theme id class and theme URL query name
      id: "pastatu-administravimas", // theme id class and theme URL query name
      imgUrl: "assets/img/pastatu-administravimas.png", // image URL
      imgAlt: "Pastatų administravimas", // image alt attribute
      layers: {
        administravimas: {
          // layer unique name
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Pastatu_administravimas/MapServer",
          featureLayerUrls: [
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Pastatu_administravimas/MapServer/1",
          ],
        },
      },
    },
    advertise: {
      url: "https://maps.vilnius.lt/maps_vilnius/?theme=ad",
      production: true, // if theme is ready for production
      // legacy: true, // legacy dojo app
      external: true,
      custom: true, // true if theme funcionality is custom
      name: "Reklamos leidimai", // theme name
      id: "leidimai", // theme id class and theme URL query name
      imgUrl: "assets/img/reklamos.png", // image URL
      imgAlt: "Reklamos vietos", // image alt attribute
    },
    schools: {
      url: "https://maps.vilnius.lt/maps_vilnius/?theme=schools",
      production: true, // if theme is ready for production
      // legacy: true, // legacy dojo app
      external: true,
      custom: true,
      name: "Švietimas", // theme name
      // id: "schools", //theme id class and theme URL query name
      id: "svietimas", // theme id class and theme URL query name
      imgUrl: "assets/img/mokyklos.png", // image URL
      imgAlt: "Švietimas", // image alt attribute
      layers: {
        mokyklos: {
          // layer unique name //
          //  dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Mokyklos/MapServer",
        },
      },
    },
    envExternal: {
      url: "https://experience.arcgis.com/experience/c7d16712c5ab4c6087a1eede67491329/",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Oro tarša", // theme name
      id: "oro-tarsa", // theme id class and theme URL query name
      imgUrl: "assets/img/aplink.png", // image URL
      imgAlt: "Oro tarša", // image alt attribute
    },
    airExternal: {
      url: "https://miestoplauciai.vilnius.lt/orotarsa/",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Miesto plaučiai", // theme name
      id: "miesto-plauciai", // theme id class and theme URL query name
      imgUrl: "assets/img/miesto_plauciai2.png", // image URL
      imgAlt: "Miesto plaučiai", // image alt attribute
    },
    tracks: {
      url: "https://vilniuskojoms.lt",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Vilnius kojoms", // theme name
      id: "vilnius-kojoms", // theme id class and theme URL query name
      imgUrl: "assets/img/ptakai.png", // image URL
      imgAlt: "Vilnius kojoms", // image alt attribute
    },
    vilnius3dExternal: {
      url: "https://3d.vilnius.lt/",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "3D Vilnius", // theme name
      id: "vilnius-3d", // theme id class and theme URL query name
      imgUrl: "assets/img/vilnius3d.png", // image URL
      imgAlt: "Vilniaus 3D modelis", // image alt attribute
    },
    bpCompareExternal: {
      url: "https://atviras.vplanas.lt/BP1/",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "BP palyginimas", // theme name
      id: "bp-palyginimas", // theme id class and theme URL query name
      imgUrl: "assets/img/bp.png", // image URL
      imgAlt: "Bendrojo plano palyginimas", // image alt attribute
    },
    openDataExternal: {
      url: "https://data-vplanas.opendata.arcgis.com",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Vilniaus atviri duomenys", // theme name
      id: "open-data", // theme id class and theme URL query name
      imgUrl: "assets/img/od.png", // image URL
      imgAlt: "Vilniaus atviri duomenys", // image alt attribute
    },
    sispTransportFlowExternal: {
      url: "https://portal.sisp.lt/portal/apps/webappviewer/index.html?id=43930ae997c1452a8db631a2aac31b15",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Transporto srautai", // theme name
      id: "sisp-transport-flow", // theme id class and theme URL query name
      imgUrl: "assets/img/tr_srautai.png", // image URL
      imgAlt: "Transporto srautai", // image alt attribute
    },
    sispTransportIntensityExternal: {
      url: "https://portal.sisp.lt/portal/apps/webappviewer/index.html?id=212c94a819344ae8994b49da93b74118",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Intensyvios sankryžos", // theme name
      id: "sisp-transport-intensity", // theme id class and theme URL query name
      imgUrl: "assets/img/sankryzu_int.png", // image URL
      imgAlt: "Intensyvios sankryžos", // image alt attribute
    },
    sispTransportExpansionExternal: {
      url: "https://vplanas.maps.arcgis.com/apps/webappviewer/index.html?id=2248869d47674f788d0623e2dae4f516",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Viešojo transporto plėtra", // theme name
      id: "sisp-transport-expansion", // theme id class and theme URL query name
      imgUrl: "assets/img/transportas.png", // image URL
      imgAlt: "Intensyvios sankryžos", // image alt attribute
    },
    happinessIndexExternal: {
      url: "https://experience.arcgis.com/experience/8c1856f8ca924ab89052e19650d80746/page/page_2/",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Laimės indeksas", // theme name
      id: "happiness-index", // theme id class and theme URL query name
      imgUrl: "assets/img/smile.png", // image URL
      imgAlt: "Laimės indeksas", // image alt attribute
    },
    treesExternal: {
      url: "https://arcg.is/jvjfe",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Apsodinkime Vilnių", // theme name
      id: "apsodinkime-vilniu", // theme id class and theme URL query name
      imgUrl: "assets/img/trees.png", // image URL
      imgAlt: "Apsodinkime Vilnių kartu", // image alt attribute
    },
    eventsExternal: {
      url: "https://renginiai.vilnius.lt/",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Vilniaus miesto renginių žemėlapis", // theme name
      id: "renginiai-vilnius", // theme id class and theme URL query name
      imgUrl: "assets/img/renginiu.png", // image URL
      imgAlt: "Vilniaus miesto renginių žemėlapis", // image alt attribute
    },
    dnrVilnius: {
      url: "https://zemelapiai.vplanas.lt/vilniausdnr/lt",
      production: true, // if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Vilniaus DNR", // theme name
      id: "renginiai-vilnius", // theme id class and theme URL query name
      imgUrl: "assets/img/Vilnius_DNR.png", // image URL
      imgAlt: "Vilniaus DNR", // image alt attribute
    },
    emptyTeam: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true, // if theme is ready for production
      hide: true, // hide from themes menu, but add route with functionality
      name: "Tuščia tema", // theme name
      // id: "civ-sauga", //theme id class and theme URL query name
      id: "empty", // theme id class and theme URL query name
      imgUrl: "assets/img/civiline-sauga.png", // image URL
      imgAlt: "Tuščia tema", // image alt attribute
      layers: {
        empty: {
          // layer unique name //
          //  dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Empty/MapServer",
          name: "Demonstraciniai sluoksniai",
        },
      },
    },
    // legacyMap: {
    //   production: false, //if theme is ready for production
    //   custom: true, // true if theme funcionality is custom
    //   name: "Senoji žemėlapio versija", //theme name
    //   id: "legacy", //theme id class and theme URL query name
    //   imgUrl: assets/img/old_version.png", //image URL
    //   imgAlt: "Senoji versija", // image alt attribute
    //   url: "http://www.vilnius.lt/vmap/t1.php" // external url if required, if not - gets internal url depending on id property
    // }
  },
  animation: {
    options: {
      animate: true, // default true
      duration: 600,
      easing: "ease-out", // Possible Values: linear | ease | ease-in | ease-out | ease-in-out
    },
  },
  search: {
    // search widget locator url
    locator:
      "https://gis.vplanas.lt/arcgis/rest/services/Lokatoriai/PAIESKA_COMPOSITE/GeocodeServer",
    addressLocator:
      "https://gis.vplanas.lt/arcgis/rest/services/Lokatoriai/ADRESAI_V1/GeocodeServer",
  },
  maintenance: {
    msg: "Puslapis laikinai nepasiekiamas - vykdomi priežiūros darbai. Atsiprašome už nepatogumus",
  },
  notFound: {
    msg: "Atsiprašome, toks puslapis neegzistuoja",
  },
};

// Additionl themes mapOptions
export const HeatingDataValues = {
  color: {
    green: "rgba(167, 206, 39, 0.8)",
    yellow: "rgba(249, 212, 31, 0.8)",
    orange: "rgba(245, 143, 58, 0.8)",
    red: "rgba(225, 8, 39, .8)",
    purple: "rgba(148, 39, 105, .8)",
  },
  label: {
    label1: "Gera (1-3)",
    label2: "Vidutinė (4-5)",
    label3: "Bloga (6-8)",
    label4: "Labai bloga (9-11)",
    label5: "Ypatingai bloga (12-15)",
  },
};

// export default CONFIG;
