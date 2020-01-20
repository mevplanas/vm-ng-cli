# Vilnius maps

Vilnius city municipality administration (VCMA) interactive maps based on [ArcGis API] ^4.13, [Angular] ^8.x. and [Angular CLI]
 
![screenshot](sreenshot.png)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## arcgis-js-api, 3rd party imports

Add  `--esModuleInterop` to script or tsconfig for importing modules in ES6 manner.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Configuration file

Add default funcionality themes with Dynamic layers based on ArcMaps *.mxd project and REST services to and existing Config.ts file.  
App uses DI for injecting configurations. You can change config file, by providing value in app.module

## Build

Run `ng build` to build the project. 

## Production

The build artifacts for production should be stored stored in the `dist/` directory. Use the `ng build --prod --deployUrl=dist/` flags for a production build and files can deployed in dist catalogs on IIS.  

## QA / mapsdev

Run `ng build -c mapsdev --deployUrl=dist/` for a QA / mapsdev server.

## Backend server.js configurations
Combine options file with `npm run options`. Upload `options` folder in dist catalog to www... directory

## Web workers !important
In order to use esri web workers follow current [Esri guide](https://github.com/esri/arcgis-webpack-plugin#usage).
Unfortunately due to compiling issues set `"buildOptimizer": false` in angular.json, but this generates large bundle size.
Use and `"optimization": true` and `"buildOptimizer": false` (this creates way larger bundle size)


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## TODO
Update ngrx-popper, which is currently not supported for Angular 8
Check for web workers updates from ESRI, if fixes added use  `"buildOptimizer": true` for a way smaller bundle size (removes 3MB)

# Notes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.14.  


Currently using express js and ejs in production. 
See private repo `vm-ng-cli-configuration` in vplanas account `https://github.com/mevplanas`
  
Check the npm packages described in the package.json  

