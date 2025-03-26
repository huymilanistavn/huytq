declare namespace global {
  interface Window {
    webWorker: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  export default class Svg extends React.Component<SvgProps> {
  }
}

declare module 'react-native-form-validator' {
  export default class ValidationComponent<P extends object, S extends object> extends React.Component<P, S> {
      validate(o: object): boolean;
      getErrorMessages(): string;
  }
}

// declare module "*.svg" {
//   import React from 'react';
//   import { SvgProps } from "react-native-svg";
//   const content: React.FC<SvgProps>;
//   export default content;
// }