/* eslint-disable no-underscore-dangle */
import schedules from '../data';
import { prepareScheduleList } from '../functions';
import { ISchedule, IScheduleWithStringPropertyRepresentation } from '../interfaces';

export default class Schedule {
    private _periods: IScheduleWithStringPropertyRepresentation[] = [];

    async manageSchedule(): Promise<void> {
        const schedules: ISchedule[] = await this.fetchSchedule();
        this._periods = prepareScheduleList(schedules);
    }

    // Имитируем запрос за данными
    fetchSchedule(): Promise<ISchedule[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                // тут была проблема со свойством startFrom у schedules.
                // startFrom имеет тип TWeekStringDay, но тайпскрипт ругался что:

                // Types of property 'startFrom' are incompatible.
                // Type 'string' is not assignable to type '"Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"'.

                // по этому передал как as ISchedule[], честно говоря не понимаю почему так, поля вроде соответствуют интерфейсу...

                resolve(schedules as ISchedule[]);
            }, 500);
        });
    }

    async init(): Promise<this> {
        await this.manageSchedule();
        return this;
    }

    get periods(): IScheduleWithStringPropertyRepresentation[] {
        return this._periods;
    }
}
