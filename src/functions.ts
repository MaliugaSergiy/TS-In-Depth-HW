/* eslint-disable no-underscore-dangle */

import { ISchedule, IScheduleWithStringPropertyRepresentation } from './interfaces';
import { IHoursAndMinutesTimeFormat } from './interfaces';
import { WeekDaysENG } from './enums';
import { IDayDuration, IDaysDurations } from './interfaces';
import {
    TArrayOfArrayOfNumbers,
    TBooleanOrNullList,
    TIntervalOrNull,
    TIntevalsList,
    TWeekStringDay,
    TWeekStringDayOrderList,
} from './types';

function getOrderedDaysBy(days: TWeekStringDayOrderList, orderByDay: TWeekStringDay): TWeekStringDayOrderList {
    const indexOfTageTDay = days.indexOf(orderByDay);

    const startOrder = days.slice(indexOfTageTDay, days.length);
    const endOrder = days.slice(0, indexOfTageTDay);

    return [...startOrder, ...endOrder];
}

function getDaysEmunKeysList(): TWeekStringDayOrderList {
    return Object.values(WeekDaysENG).filter(elem => typeof elem !== 'number') as TWeekStringDayOrderList;
}

function getDaysOrderArray(startFromDay: TWeekStringDay = 'Sunday'): TWeekStringDayOrderList {
    const defaultDayOrder: TWeekStringDayOrderList = getDaysEmunKeysList();
    const isExistDay: boolean = defaultDayOrder.some((day: string): boolean => day === startFromDay);
    if (!isExistDay) {
        console.warn('passed invalid DAY title. Implemented default order');

        return defaultDayOrder;
    }

    const orderedList = getOrderedDaysBy(defaultDayOrder, startFromDay);

    return orderedList;
}

const sliceStringTo = (amountOfChars: number) => (str: TWeekStringDay): string => str.slice(0, amountOfChars);

const createShortedOrder = (daysOrder: TWeekStringDayOrderList, charAmount: number): string[] =>
    daysOrder.map(sliceStringTo(charAmount));

function getIntevalsList(order: TWeekStringDayOrderList, daysDurations: IDaysDurations): TIntevalsList {
    return order.map((day: TWeekStringDay): TIntervalOrNull => daysDurations[day] || null);
}

function getIsDuplicateToPrevious(item: IDayDuration, index: number, arr: TIntevalsList) {
    let previousItem: TIntervalOrNull, isCurrentDuplicatesPrevious: boolean;

    if (item === null) {
        return null;
    }

    if (index === 0) {
        return false;
    }

    previousItem = arr[index - 1];
    if (!previousItem) {
        return false;
    }

    isCurrentDuplicatesPrevious = item.start === previousItem.start && item.end === previousItem.end;

    if (isCurrentDuplicatesPrevious) {
        return true;
    }

    return false;
}

function getIsDuplicateToPreviousList(list: TIntevalsList): TBooleanOrNullList {
    return list.map(getIsDuplicateToPrevious);
}

function getReducedScheduleList(list: TBooleanOrNullList): TArrayOfArrayOfNumbers {
    return list.reduce(
        (
            accum: TArrayOfArrayOfNumbers,
            curr: boolean,
            index: number,
            arr: TBooleanOrNullList,
        ): TArrayOfArrayOfNumbers => {
            const accumNextIndex = accum.length;
            const next = arr[index + 1];

            if (curr) {
                return accum;
            }

            if (curr === null) {
                return accum;
            }

            if (next) {
                accum[accumNextIndex] = [index, getLastDuplicate(index + 1, arr)];
                return accum;
            }

            accum[accumNextIndex] = [index];

            return accum;
        },
        [],
    );
}

function getLastDuplicate(startIndex: number, list: TBooleanOrNullList) {
    let lastIndex = startIndex;
    while (list[lastIndex + 1]) {
        lastIndex = lastIndex + 1;
    }

    return lastIndex;
}

function numericToTime(hours: number): IHoursAndMinutesTimeFormat {
    const _hours = Math.floor(Math.abs(hours));
    const minutes = Math.floor((Math.abs(hours) * 60) % 60);

    const output = {
        hours: _hours,
        minutes,
    };

    return output;
}

function getTwelveHoursFormatTime(time: IHoursAndMinutesTimeFormat): string {
    const BEFORE_MIDDAY_SUFFIX = 'AM';
    const AFTER_MIDDAY_SUFFIX = 'PM';
    const MIDDAY_TIME = 12;

    const beforeMiddayCondition = time.hours < MIDDAY_TIME + 1;
    let hours = beforeMiddayCondition ? time.hours : time.hours - MIDDAY_TIME;

    const usedSuffix = beforeMiddayCondition ? BEFORE_MIDDAY_SUFFIX : AFTER_MIDDAY_SUFFIX;

    let _hours = getStringTimeProperty(hours);
    let _minutes = getStringTimeProperty(time.minutes);

    const formatedString = `${_hours}:${_minutes} ${usedSuffix}`;

    return formatedString;
}

function getStringTimeProperty(value: number): string {
    return value < 10 ? '0' + value : String(value);
}

function getListOfTimePropertiyStrings(template: TArrayOfArrayOfNumbers, intervalList: TIntevalsList): string[] {
    return template.map(item => {
        const dayIndex = item[0];
        const { start, end } = intervalList[dayIndex];

        const startTimeNumerik = numericToTime(start);
        const endTimeNumerik = numericToTime(end);

        const startTimeHumanizedString = getTwelveHoursFormatTime(startTimeNumerik);
        const endTimeHumanizedString = getTwelveHoursFormatTime(endTimeNumerik);

        const output = `${startTimeHumanizedString} - ${endTimeHumanizedString}`;

        return output;
    });
}

function getDayRangePropertyList(template: TArrayOfArrayOfNumbers, shortOrder: string[]): string[] {
    return template.map(item => {
        const [firstDayIndex, lastDayIndex] = item;

        return `${shortOrder[firstDayIndex]}${lastDayIndex ? '-' + shortOrder[lastDayIndex] : ''}`;
    });
}

function prepareScheduleList(data: ISchedule[]): IScheduleWithStringPropertyRepresentation[] {
    return data.map(item => {
        const daysOrderArray = getDaysOrderArray(item.startFrom);
        console.log('🚀line 183 ~ DaysOrderArray - получаем список строк дней начиная с указанного', daysOrderArray);
        const shortOrder = createShortedOrder(daysOrderArray, 3);
        console.log('🚀 line 185 ~ shortOrder - Укорачиваем длину тайтлов дней до 3х символов', shortOrder);
        const intervalList = getIntevalsList(daysOrderArray, item.days);
        console.log(
            '🚀 line 187 ~ intervalList - получаем массив с значениями расписаний по дням - {start: number, end: number} | null',
            intervalList,
        );
        const isDuplicateToPreviousList = getIsDuplicateToPreviousList(intervalList);
        console.log(
            '🚀 line 192 ~ isDuplicateToPreviousList - список "маркеров" - является ли расписание текущего дня аналогичным предыдущему',
            isDuplicateToPreviousList,
        );
        const reducedScheduleList = getReducedScheduleList(isDuplicateToPreviousList);
        console.log(
            '🚀 ~ file: functions.ts ~ line 198 ~ prepareScheduleList ~ reducedScheduleList',
            reducedScheduleList,
        );
        const listOfTimePropertiyStrings = getListOfTimePropertiyStrings(reducedScheduleList, intervalList);
        console.log(
            '🚀 ~ file: functions.ts ~ line 203 ~ prepareScheduleList ~ listOfTimePropertiyStrings',
            listOfTimePropertiyStrings,
        );
        const dayRangePropertyList = getDayRangePropertyList(reducedScheduleList, shortOrder);
        console.log(
            '🚀 ~ file: functions.ts ~ line 205 ~ prepareScheduleList ~ dayRangePropertyList',
            dayRangePropertyList,
        );

        const sheduleList = dayRangePropertyList.map(
            (dayProperty: string, index: number): string => `${dayProperty}: ${listOfTimePropertiyStrings[index]}`,
        );
        console.log('🚀 ~ file: functions.ts ~ line 216 ~ prepareScheduleList ~ sheduleList', sheduleList);

        return {
            ...item,
            sheduleList,
        };
    });
}

export {
    getDaysOrderArray,
    getDaysEmunKeysList,
    createShortedOrder,
    getIntevalsList,
    getIsDuplicateToPreviousList,
    getReducedScheduleList,
    numericToTime,
    getTwelveHoursFormatTime,
    getListOfTimePropertiyStrings,
    getDayRangePropertyList,
    prepareScheduleList,
};
