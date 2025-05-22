import { App } from 'vue';
import { Defaults } from './utils/defaults';
import './styles/main.css';
declare const _default: {
    install: (app: App<any>, defaults?: Defaults) => void;
};
export default _default;
export * from './components';
export { setupDefaults as setupCalendar } from './utils/defaults';
export { popoverDirective } from './utils/popovers';
