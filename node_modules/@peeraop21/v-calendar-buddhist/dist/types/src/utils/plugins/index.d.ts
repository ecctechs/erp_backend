import { App as Application, Component } from 'vue';
import { Defaults } from '../defaults';
export declare const registerComponent: (instance: Application, component: Component, defaults?: Defaults) => void;
export declare const registerComponentProgrammatic: (instance: Application, property: string, component: Component) => void;
