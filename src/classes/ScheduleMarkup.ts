/* eslint-disable @typescript-eslint/indent */
import { IScheduleWithStringPropertyRepresentation } from './../interfaces';

export default class ScheduleMarkup {
    markup: DocumentFragment = null;
    container: HTMLElement = null;

    constructor(private periods: IScheduleWithStringPropertyRepresentation[]) {
        this.createMarkup(this.periods);
        this.container = document.getElementById('periods');

        this.insertMarkup(this.markup, this.container);
    }

    insertMarkup(markup: DocumentFragment, container: HTMLElement): void {
        if (container) {
            container.appendChild(markup);
        }
    }

    createMarkup(periods): void {
        const fragmentElement: DocumentFragment = document.createDocumentFragment();
        const periodElementsList: HTMLLIElement[] = periods.map(
            (elementData: IScheduleWithStringPropertyRepresentation, index: number) =>
                this.createPeriodElement(elementData, index),
        );
        periodElementsList.forEach(element => fragmentElement.appendChild(element));
        this.markup = fragmentElement;
    }

    createPeriodElement(elementData: IScheduleWithStringPropertyRepresentation, index: number): HTMLLIElement {
        const liPeriodElement: HTMLLIElement = document.createElement('li');
        const html: string = `
            <div class="box">
                <div class="main">
                    <h2>Period ${index + 1}</h2>
                    <ul>
                        ${elementData.sheduleList
                            .map(
                                item => `
                            <li>
                                ${item}
                            </li>`,
                            )
                            .join('')}
                    </ul>
                </div>
                <div class="raw">
                    <p><u>RAW DATA:</u></p>
                    <pre>
                        ${JSON.stringify(elementData.days, null, '  ')}
                    </pre></div>
            </div>`;

        liPeriodElement.innerHTML = html;
        return liPeriodElement;
    }
}
