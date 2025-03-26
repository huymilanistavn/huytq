import type { NavigationSwitchProp } from 'react-navigation';
import Value from './functionals/common/value';
import * as Api from './functionals/common/api';
import * as Function from './functionals/common/function';
import Sound from './functionals/common/sound';
import Styles, * as props from './styles/style';
import Storage from './functionals/common/storage';
import MatomoTracker from 'matomo-tracker-react-native';

export namespace g {
    export const api = Api.default;
    export const fn = Function.default;
    export const sound = Sound;
    export const callNumber = Function.callNumber;
    export const storage = Storage;
    export const value = Value;
    export type NavigationStackProp = NavigationSwitchProp & {
        setOptions: (options: object) => void
    };
    export const styles = { ...Styles, props };

    export const MatomoInstance = new MatomoTracker({
        urlBase: 'https://analytics-s4.com/', // required
        // trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
        siteId: 3, // required, number matching your Matomo project
        userId: 'UID76903202_Pirlo' // optional, default value: `undefined`.
        // disabled: false, // optional, default value: false. Disables all tracking operations if set to true.
        // log: false  // optional, default value: false. Enables some logs if set to true.
    });
}
