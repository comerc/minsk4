/// <reference types="react-scripts" />

// HOTFIX for reshadow
declare namespace JSX {
  interface IntrinsicElements {
    [name: string]: any
  }
}
