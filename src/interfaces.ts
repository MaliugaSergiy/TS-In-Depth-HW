import { TWeekStringDay } from './types';

export interface IDayDuration {
    start: number;
    end: number;
}

export interface IDaysDurations {
    // [prop: string]: IDay;
    Sunday?: IDayDuration;
    Monday?: IDayDuration;
    Tuesday?: IDayDuration;
    Wednesday?: IDayDuration;
    Thursday?: IDayDuration;
    Friday?: IDayDuration;
    Saturday?: IDayDuration;
}
export interface ISchedule {
    title: string;
    startFrom?: TWeekStringDay;
    days: IDaysDurations;
}

export interface IScheduleWithStringPropertyRepresentation extends ISchedule {
    sheduleList: string[];
}

export interface IHoursAndMinutesTimeFormat {
    hours: number;
    minutes: number;
}
