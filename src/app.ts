/* eslint-disable no-underscore-dangle */

import { Schedule } from './classes';
import ScheduleMarkup from './classes/ScheduleMarkup';

const sheduleInstance = new Schedule();

sheduleInstance.init().then(instance => {
    new ScheduleMarkup(instance.periods);
});
