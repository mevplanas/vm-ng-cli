export interface DataStore {
  elderates: Elderates[];
  mainInfo: MainInfo[];
  summary: Summary[];
  info: Info[];
}

export interface Elderates {
  ID: number;
  LABEL: string;
}

export interface MainInfo {
  GARDEN_ID: number;
  LABEL: string;
  EMAIL: string;
  PHONE: string;
  FAX: string;
  ELDERATE: number;
  ELDERATE2: string;
  ELDERATE3: string;
  ELDERATE4: string;
  SCHOOL_TYPE: string;
  WEBSITE: string;
}

export interface Summary {
  DARZ_ID: number;
  CHILDS_COUNT: number;
  FREE_SPACE: number;
}

export interface Info {
  DARZ_ID: number;
  LAN_LABEL: string;
  TYPE_LABEL: string;
  CHILDS_COUNT: number;
  FREE_SPACE: number;
}
