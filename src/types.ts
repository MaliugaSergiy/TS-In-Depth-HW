import { WeekDaysENG } from './enums';
import { ISchedule, IDayDuration } from './interfaces';

type TWeekStringDay = keyof typeof WeekDaysENG;
type TWeekStringDayOrderList = TWeekStringDay[];
/**
 * / хотел расширить TWeekStringDay, указав строгое ограничение по длине массива. Что бы гарантировать что все дни присутствуют. не получилось...
 */
// type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & { length: TLength };
// type TupleWeeekDays<T> = Tuple<T, 7>;

type TSchedulesList = ISchedule[];

type TIntervalOrNull = IDayDuration | null;

type TIntevalsList = TIntervalOrNull[];

type TBooleanOrNull = boolean | null;
type TBooleanOrNullList = TBooleanOrNull[];
type TArrayOfArrayOfNumbers = number[][];

export {
    TWeekStringDay,
    TWeekStringDayOrderList,
    TSchedulesList,
    TIntevalsList,
    TIntervalOrNull,
    TBooleanOrNullList,
    TArrayOfArrayOfNumbers,
};
