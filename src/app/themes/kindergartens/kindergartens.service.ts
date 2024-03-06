import { Injectable } from "@angular/core";

import { ObservableInput } from "rxjs";

import QueryTask from "arcgis-js-api/tasks/QueryTask";
import Query from "arcgis-js-api/tasks/support/Query";

export interface DataStore {
  elderates: any[];
  mainInfo: any[];
  summary: any[];
  info: any[];
}

@Injectable()
export class KindergartensService {
  constructor() {}

  getAllQueryDataPromise(urlStr: string, outFields: string[]) {
    const query = this.addQuery();
    const queryTask = this.addQueryTask(urlStr);
    query.where = "1=1";
    query.outFields = outFields;
    query.returnGeometry = false;
    query.maxRecordCountFactor = 5;
    return queryTask
      .execute(query)
      .then((r) =>
        r.features.map((feature) => feature.attributes)
      ) as ObservableInput<ObservableInput<any>>;
  }

  addQuery() {
    return new Query();
  }

  addQueryTask(url: string) {
    return new QueryTask({ url });
  }
}
