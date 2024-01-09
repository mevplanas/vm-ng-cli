"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../../environments/environment");
if (environment_1.environment.mapsdev) {
  console.log(
    "%c MapsDev",
    "color: green; font-weight:bold",
    environment_1.environment
  );
}
exports.CONFIG = {
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
      ortofotoDetailed19Url:
        "https://opencity.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/ORTO_2019_LKS/MapServer",
      ortofotoFull19Url:
        "https://opencity.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/ORTO_2019_LKS_FULL/MapServer",
      basemapEngineeringUrl:
        "https://gis.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/Vilnius_Inzinerija/MapServer",
      geometryUrl:
        "https://gis.vplanas.lt/arcgis/rest/services/Utilities/Geometry/GeometryServer",
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
          name: "Input_area",
        },
        limitsFrontEnd: 2.1,
        title: "Atsisiųsti topografijos FGDB / DWG fragmentą:",
        message: "Atsisiųskite fgdb arba dwg ištraukas zip formatu:",
        icon: "esri-icon-layers",
        aproxExtractTime: 10,
        zipFiles: {
          zip1: {
            name: "FGDB_zip",
            title: "FGDB",
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
        limitsFrontEnd: 4.1,
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
      production: true,
      name: "Planavimas ir statyba",
      // id: "teritory-planning", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Teritorijų planavimo ir statybų temoje rasite informaciją apie šių sluoksnių grupes: kaimynijos, bendrasis planas, teritorijų planavimo registras, hidrantai, detalieji planai, koncepcijos, gatvių kategorijos, raudonosios linijos, leidimai statyti, inžineriniai projektai, specialūs planai, nomenklatūra, gyventojų tankumas, projektinės seniūnaitijų ribos",
      id: "teritoriju-planavimas",
      imgUrl: "assets/img/teritorijos.png",
      imgAlt: "Teritorijų planavimas",
      layers: {
        teritorijuPlanavimas: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Teritoriju_planavimas/MapServer",
          name: "Teritorijų planavimas ir statyba:",
          isGroupService: true,
          opacity: 0.9,
        },
      },
    },
    teritoryReturn: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=teritory-return",
      production: true,
      name: "Žemės grąžinimas",
      // id: "teritory-return", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Teritorijų grąžinimo temoje rasite informaciją apie valstybinius žemės plotus, žemės gražinimą /atkūrimą, specialiuosius planus",
      id: "zemes-grazinimas",
      imgUrl: "assets/img/zeme.png",
      imgAlt: "Teritorijų grąžinimas",
      layers: {
        teritorijuGrazinimas: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Zemes_grazinimas/MapServer",
          name: "Teritorijų grąžinimas:",
          isGroupService: true,
        },
      },
    },
    TeritoryMaintenance: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=teritory-maintenance",
      production: true,
      name: "Miesto tvarkymas",
      // id: "teritory-maintenance", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Miesto tvarkymo temoje rasite informaciją apie šių sluoksnių grupes: gatvių priežūra, gatvių ir pėsčiųjų takų tvarkymo darbai, tvarkomos miesto teritorijos, medžių inventorizacija, atliekų tvarkymas",
      id: "miesto-tvarkymas",
      imgUrl: "assets/img/miesto-tvarkymas.png",
      imgAlt: "Miesto tvarkymas",
      layers: {
        miestoTvarkymas: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Miesto_tvarkymas/MapServer",
          name: "Miesto tvarkymas:",
          opacity: 0.6,
          isGroupService: true,
          // TODO add gallery feature
          gallery: false,
        },
        vilniausVandenys: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vv.lt/arcgis/rest/services/Public/Avarijos_public/MapServer",
          opacity: 0.8,
          name: "Vandentiekio ir nuotekų tinklo avarijos:", // dynamicLayers group name
        },
        sisp: {
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
          visible: true,
          title: "UAB Grinda automobilių parko stebėjimas",
          setRotation: true,
          rotationAttribute: "direction",
          labelFeatures: ["plate"],
        },
      },
    },
    environment: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=env",
      production: true,
      name: "Aplinkosauga",
      // id: "env", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Aplinkosaugos temoje rasite informaciją apie šių sluoksnių grupes: triukšmo sklaida, tyliosios triukšmo ir prevencinės zonos, oro tarša, dugno nuosėdos, paviršinio vandens tarša, uždarytų savartynų tarša",
      id: "aplinkosauga",
      imgUrl: "assets/img/aplinkosauga.png",
      imgAlt: "Aplinkosauga",
      layers: {
        aplinkosauga: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Aplinkosauga/MapServer",
          name: "Aplinkosauginiai sluoksniai:",
          opacity: 0.7,
          isGroupService: true, // if layers has grouping in mxd / value for administration purpose only
        },
      },
    },
    cyclingTracks: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=cycling-tracks",
      production: true,
      name: "Transportas / Dviračiai",
      // id: "cycling-tracks", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Transporto temoje rasite informaciją apie rinkliavos zonas, kiss and ride stoteles, vaizdo stebėsenos vietas, viešąjį transportą, dviračių trasas, eismo įvykius, juodąsias dėmes",
      id: "transportas",
      imgUrl: "assets/img/dviraciai.png",
      imgAlt: "Transportas / Dviračiai",
      layers: {
        // accidentsRaster: { // layer unique name //
        //   dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
        //   "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Eismo_ivykiu_tankumas/MapServer",
        //   name: "Eismo įvykių tankumas", // dynamicLayers group name
        //   opacity: 0.7,
        //   isRaster: true //is layer Ratser , do not identify layer if true / default value is false
        // },
        transportas: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Transportas/MapServer",
          name: "Transportas / Dviračiai:",
          opacity: 0.9,
        },
        sisp: {
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
          visible: true,
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
            type: "unique-value",
            field: "trCode",
            legendOptions: {
              title: " ", // leave empty legend title
            },
            defaultLabel: "-",
            defaultSymbol: { type: "simple-fill" },
            uniqueValueInfos: [
              {
                // All features with value of "North" will be blue
                value: "1",
                label: "Troleibusai",
                symbol: {
                  type: "simple-marker",
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
                  type: "simple-marker",
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
                type: "rotation",
                field: "angle",
                rotationType: "geographic",
              },
            ],
          },
        },
      },
    },
    leisure: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=laisvalaikis",
      production: true,
      name: "Laisvalaikis",
      description:
        "Laisvalaikio temoje rasite informaciją apie atviras sales, viešuosius tualetus, jaunimo veiklą, pėsčiųjų trasas",
      id: "laisvalaikis",
      imgUrl: "assets/img/laisvalaikis.png",
      imgAlt: "Laisvalaikis",
      layers: {
        laisvalaikis: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Laisvalaikis/MapServer",
          name: "Laisvalaikis", // dynamicLayers group name
        },
      },
    },
    publicCaffes: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=caffee",
      production: true,
      name: "Lauko kavinės",
      // id: "caffee", //theme id class and theme URL query name
      description:
        "Lauko kavinių temoje rasite informaciją apie lauko kavines, jų užimamus plotus, leidimus",
      id: "kavines",
      imgUrl: "assets/img/kavines.png",
      imgAlt: "Lauko kavinės",
      layers: {
        publicCaf: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/lauko_kavines/MapServer",
          name: "Lauko kavinės", // dynamicLayers group name
        },
      },
    },
    civilSecurity: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true,
      name: "Civilinė sauga",
      // id: "civ-sauga", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Civilinės saugos temoje rasite informaciją apie gyventojų perspėjimo sirenas, kolektyvinės apsaugos statinius, gyventojų evakuavimo punktus, vandentiekio ir nuotekų tinklo avarijas",
      id: "civiline-sauga",
      imgUrl: "assets/img/civiline-sauga.png",
      imgAlt: "Civilinė sauga",
      layers: {
        civilFacility: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Civiline_sauga/MapServer",
          opacity: 0.8,
          name: "Civilinė sauga", // dynamicLayers group name
        },
      },
    },
    elderships: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true,
      name: "Seniūnijos",
      // id: "civ-sauga", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Seniūnijų temoje rasite informaciją apie seniūnijų ribas, būstines, seniūnaitijas, kaimynijas, planuojamus miesto tvarkymo darbų",
      id: "seniunijos",
      imgUrl: "assets/img/seniunijos.png",
      imgAlt: "Seniūnijos",
      layers: {
        elderships: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Seniunijos/MapServer",
          opacity: 1,
          name: "Seniūnijos", // dynamicLayers group name
        },
      },
    },
    socialServices: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true,
      name: "Socialinės paslaugos",
      // id: "civ-sauga", //theme id class and theme URL query name
      description:
        "Socialinių paslaugų temoje rasite informaciją apie socialine paslaugas teikiančias įstaigas",
      id: "socialines-paslaugos",
      imgUrl: "assets/img/soc-paslaugos.png",
      imgAlt: "Socialinės paslaugos",
      layers: {
        socialLayer: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Socialines_paslaugos/MapServer",
          opacity: 1,
          name: "Socialinės paslaugos", // dynamicLayers group name
        },
      },
    },
    safeCity: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true,
      name: "Saugus miestas",
      // id: "civ-sauga", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Saugaus miesto temoje rasite informaciją apie vaizdo stebėjimo kameras, bešeimininkių kačių kastravimo programų vykdymą",
      id: "saugus-miestas",
      imgUrl: "assets/img/saugus-miestas.png",
      imgAlt: "Saugus miestas",
      layers: {
        safeCityLayer: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Saugus_miestas/MapServer",
          opacity: 1,
          name: "Saugus miestas", // dynamicLayers group name
        },
      },
    },
    odlTownProjects: {
      production: "production",
      hide: true,
      name: "Senamiesčio projektai",
      // id: "civ-sauga", //theme id class and theme URL query name
      description: "Senamiesčio projektai",
      id: "senamiescio-projektai",
      imgUrl: "assets/img/ptakai.png",
      imgAlt: "Senamiesčio projektai",
      zoomLevel: 4,
      zoomCoords: [583035.2149091947, 6061202.102446364],
      layers: {
        oldTownLayer: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/TESTAVIMAI/maps_vilnius_kilpos/MapServer",
          opacity: 1,
          name: "Senamiesčio projektai",
        },
      },
    },
    propertyUnits: {
      production:
        !environment_1.environment.production ||
        environment_1.environment.mapsdev,
      name: "Savivaldybės turtas",
      // id: "civ-sauga", //theme id class and theme URL query name
      description: "Savivaldybės turtas",
      id: "savivaldybes-turtas",
      imgUrl: "assets/img/projektai.png",
      imgAlt: "Savivaldybės turtas",
      zoomLevel: 4,
      zoomCoords: [583035.2149091947, 6061202.102446364],
      layers: {
        propUnitsLayer: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Savivaldybes_turtas/MapServer",
          opacity: 1,
          name: "Savivaldybės turtas",
        },
      },
    },
    quarterlyRenovation: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      custom: true,
      production: false,
      name: "Kvartalinė renovacija",
      // id: "civ-sauga", //theme id class and theme URL query name
      description:
        "Kvartalinės renovacijos temoje rasite informaciją apie Vilniaus miesto kvartalų palyginimą įvairiais pjūviais",
      id: "kvartaline-renovacija",
      imgUrl: "assets/img/kvart-renovacija.png",
      imgAlt: "Kvartalinė renovacija",
      layers: {
        quarters: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Kvartaline_renovacija/MapServer",
          opacity: 1,
          name: "Vilniaus miesto kvartalai", // dynamicLayers group name
        },
      },
    },
    buildings: {
      production: true,
      custom: true,
      name: "Kvartalų renovacija",
      // tslint:disable-next-line: max-line-length
      description:
        "Gyvenamųjų pastatų šilumo suvartojimo informacija, energetinis efektyvumas, faktinio energijos suvartojimo klasės, mėnesiniai šilumos suvartojimai pagal mokėjimus už šilumą",
      // id: "theme-buildings", //theme id class and theme URL query name
      id: "pastatai",
      imgUrl: "assets/img/pastatai.png",
      imgAlt: "Šilumos suvartojimas",
      layers: {
        // quarters: { // layer unique name //
        //   dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
        //     "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Kvartaline_renovacija/MapServer",
        //   opacity: 1,
        //   name: "Vilniaus miesto kvartalai" // dynamicLayers group name
        // },
        silumosSuvartojimas: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Pastatai_statyba_kvartalai/MapServer",
          name: "Pastatai",
        },
      },
    },
    itvTheme: {
      production: true,
      version: "arcgis4",
      hide: false,
      custom: true,
      name: "Investiciniai projektai",
      // tslint:disable-next-line: max-line-length
      description:
        "Interaktyvus investicinių projektų žemėlapis yra skirtas Vilniaus gyventojams ir miesto svečiams patogiai ir išsamiai susipažinti su naujausia informacija apie mieste planuojamus, vykdomus ir jau įgyvendintus investicinius projektus",
      id: "projektai",
      imgUrl: "assets/img/projektai.png",
      imgAlt: "Investiciniai projektai",
      info: "Uses static menu legend",
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
      production: true,
      custom: true,
      name: "Darželiai",
      // id: "theme-buildings", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Ikimokyklinių ugdymo įstaigų (darželių, privačių darželių, kitų įstaigų) paieška pagal gyvenamąjį adresą, tipą, kalbą ar grupės amžių",
      id: "darzeliai",
      imgUrl: "assets/img/darzeliai.png",
      imgAlt: "Darželiai",
      layers: {
        darzeliai: {
          // dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Darzeliai/MapServer",
          name: "Darželiai",
        },
      },
    },
    waist: {
      production:
        !environment_1.environment.production ||
        environment_1.environment.mapsdev,
      custom: true,
      name: "Atliekų tvarkymas",
      // id: "theme-buildings", //theme id class and theme URL query name
      // tslint:disable-next-line: max-line-length
      description:
        "Atliekų tvarkymo temoje  rasite informaciją apie atliekų išvežimo taškus, grafikus, vėlavimus ir kitą statistinę informaciją",
      id: "atlieku-tvarkymas",
      imgUrl: "assets/img/darzeliai.png",
      imgAlt: "Atliekų tvarkymas",
      layers: {
        atliekos: {
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
      production: true,
      custom: true,
      name: "Pastatų administravimas",
      // id: "theme-buildings", //theme id class and theme URL query name
      id: "pastatu-administravimas",
      imgUrl: "assets/img/pastatu-administravimas.png",
      imgAlt: "Pastatų administravimas",
      layers: {
        administravimas: {
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
      production: true,
      // legacy: true, // legacy dojo app
      external: true,
      custom: true,
      name: "Reklamos leidimai",
      id: "leidimai",
      imgUrl: "assets/img/reklamos.png",
      imgAlt: "Reklamos vietos", // image alt attribute
    },
    tracks: {
      url: "https://vilniuskojoms.lt",
      production: true,
      external: true,
      custom: true,
      name: "Vilnius kojoms",
      id: "vilnius-kojoms",
      imgUrl: "assets/img/ptakai.png",
      imgAlt: "Vilnius kojoms", // image alt attribute
    },
    schools: {
      url: "https://maps.vilnius.lt/maps_vilnius/?theme=schools",
      production: true,
      // legacy: true, // legacy dojo app
      external: true,
      custom: true,
      name: "Švietimas",
      // id: "schools", //theme id class and theme URL query name
      id: "svietimas",
      imgUrl: "assets/img/mokyklos.png",
      imgAlt: "Švietimas",
      layers: {
        mokyklos: {
          //  dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Mokyklos/MapServer",
        },
      },
    },
    vilnius3dExternal: {
      url: "https://3d.vilnius.lt/",
      production: true,
      external: true,
      custom: true,
      name: "3D Vilnius",
      id: "vilnius-3d",
      imgUrl: "assets/img/vilnius3d.png",
      imgAlt: "Vilniaus 3D modelis", // image alt attribute
    },
    bpCompareExternal: {
      url: "https://atviras.vplanas.lt/BP1/",
      production: true,
      external: true,
      custom: true,
      name: "BP palyginimas",
      id: "bp-palyginimas",
      imgUrl: "assets/img/bp.png",
      imgAlt: "Bendrojo plano palyginimas", // image alt attribute
    },
    treesExternal: {
      url: "https://arcg.is/jvjfe",
      production: true,
      external: true,
      custom: true,
      name: "Apsodinkime Vilnių",
      id: "apsodinkime-vilniu",
      imgUrl: "assets/img/trees.png",
      imgAlt: "Apsodinkime Vilnių kartu", // image alt attribute
    },
    openDataExternal: {
      url: "https://data-vplanas.opendata.arcgis.com",
      production: true,
      external: true,
      custom: true,
      name: "Vilniaus atviri duomenys",
      id: "open-data",
      imgUrl: "assets/img/od.png",
      imgAlt: "Vilniaus atviri duomenys", // image alt attribute
    },
    emptyTeam: {
      // url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true,
      hide: true,
      name: "Tuščia tema",
      // id: "civ-sauga", //theme id class and theme URL query name
      id: "empty",
      imgUrl: "assets/img/civiline-sauga.png",
      imgAlt: "Tuščia tema",
      layers: {
        empty: {
          //  dynamicService URL, only 1 url per uniquer Layer
          dynimacLayerUrls:
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Empty/MapServer",
          name: "Demonstraciniai sluoksniai",
        },
      },
    },
  },
  animation: {
    options: {
      animate: true,
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
exports.HeatingDataValues = {
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
//# sourceMappingURL=config.js.map
