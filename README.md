# VmNgCli

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.14.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## arcgis-js-api, 3rd party imports

Add  `--esModuleInterop` to script or tsconfig for importing modules in ES6 manner.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `ng build --prod --deployUrl=dist/` flags for a production build and files can deployed in dist catalogs on IIS.  

## Web workers
In order to use esri web workers follow current [Esri guide](https://github.com/esri/arcgis-webpack-plugin#usage).
Unfortunately due to compiling issues set `"optimization": false` in angular.json, but this generates big bundle size.
Use and `"optimization": true` and `"buildOptimizer": false`


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Update
Update ngrx-popper, which is currently not supported for Angular 8
