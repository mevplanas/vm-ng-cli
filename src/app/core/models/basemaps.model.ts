export const BASEMAPS: Basemap[] = [
  {
    id: "base-dark",
    name: "Tamsus",
    serviceName: "basemapDarkUrl", // based on Options.ts
  },
  {
    id: "base-map",
    name: "Žemėlapis",
    serviceName: "basemapUrl", // based on Options.ts
  },
  // {
  //   id: "base-map-19",
  //   name: "Orto / 2019",
  //   serviceName: "ortofotoDetailed19Url", // based on Options.ts
  // },
  {
    id: "base-map-19-full",
    name: "Orto / 2019",
    serviceName: "ortofotoFull19Url", // based on Options.ts
  },
  {
    id: "base-orto",
    name: "Orto / 2022",
    serviceName: "ortofotoUrl", // based on Options.ts
  },
  // {
  //   id: 'base-en-t',
  //   name: 'Inžinerija / T', // engineering plus base-dark
  //   serviceName: 'basemapEngineeringUrl' // based on Options.ts
  // },
  // {
  //   id: 'base-en-s',
  //   name: 'Inžinerija / Ž', // engineering plus base-map
  //   serviceName: 'basemapEngineeringUrl' // based on Options.ts
  // }
  {
    id: "base-imagery",
    name: "Aktualiausia ortofoto",
    serviceName: "imagery2024", // based on Options.ts
  },
];

export class Basemap {
  id: string;
  name: string;
  serviceName: string;
}
