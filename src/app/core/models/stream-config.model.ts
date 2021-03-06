export interface StreamConfig {
  url: string;
  visible?: boolean;
  title: string;
  setRotation?: boolean;
  rotationAttribute?: string;
  color?: string;
  style?: string;
  labelFeatures?: string[];
  stops?: any;
  renderer?: any;
}
