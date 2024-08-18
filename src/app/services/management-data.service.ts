import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { CommonEvent } from '../modules/table.modules';
import { removeDuplicateKeysAndLength } from '../utils/removeDuplicateKeysAndLength';

export interface FieldDefinition {
    key: string;
    type: 'text' | 'number' | 'date' | 'checkbox';
}

@Injectable({
    providedIn: 'root'
})
export class DataManagementService {
    private data: CommonEvent[] = [];
    exceptFields: string[] = []
    commonFields: string[] = []
    eventTypes: string[] = []
    filteredData: any[] = [];
    sortByDate: boolean = false;

    constructor(private fetchDataService: FetchDataService) {
        this.loadData();
        this.checkDataDeps()
    }

    private loadData(): void {
        this.fetchDataService.getData().subscribe({
            next: (data: CommonEvent[]) => this.data = data,
            error: (err) => console.error('Error loading data', err)
        });
    }

    getData(): CommonEvent[] {
        return this.data;
    }

    addItem(item: CommonEvent) {
        item.eventId = this.getNextId();
        item.startDateTime = item.startDateTime || new Date().valueOf()
        item.ageInDays = item.ageInDays || 0

        return this.fetchDataService.postData(item)
    }

    updateItem(item: CommonEvent) {
        item.ageInDays = item.ageInDays || 0
        return this.fetchDataService.putData(item)
    }

    deleteItem(id: number) {
        return this.fetchDataService.deleteData(id)
    }

    filterByDates(): void {
        this.sortByDate = !this.sortByDate;
        this.filteredData = this.sortByDate
            ? this.filteredData.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
            : this.data;
    }

    private getNextId(): number {
        const maxId = this.data.reduce((max, item) => item.eventId > max ? item.eventId : max, 0);
        return maxId + 1;
    }

    checkDataDeps() {
        this.eventTypes = [...new Set(this.data.map((item) => item.type))]
        type KeyedArray = { [key: string]: any[] };
        const fieldCounts = this.data.reduce((counts: any, obj: any) => {
            Object.keys(obj).forEach(key => {
                counts[key] = (counts[key] || 0) + 1;
            });
            return counts;
        }, {});
        this.exceptFields = Object.keys(fieldCounts).filter(key => fieldCounts[key] !== this.data.length);
        this.commonFields = Object.keys(fieldCounts).filter(key => fieldCounts[key] === this.data.length);
        const depsArr = this.data.map((item: any) => {
            const listOfExceptFields = this.exceptFields.filter((field: any) => item[field] !== undefined);
            return { [item.type]: listOfExceptFields };
        });
        const uniqueDepsArr = removeDuplicateKeysAndLength(depsArr);
        const result: KeyedArray = uniqueDepsArr.reduce((acc: any, obj: any) => {
            const key = Object.keys(obj)[0];
            acc[key] = obj[key];
            return acc;
        }, {});

        return result;
    }

    getTypes(item: any): FieldDefinition[] {
        const commonFields: FieldDefinition[] = [
            { key: 'cowId', type: 'number' },
            { key: 'animalId', type: 'number' },
            { key: 'eventId', type: 'number' },
            { key: 'deletable', type: 'checkbox' },
            { key: 'lactationNumber', type: 'number' },
            { key: 'daysInLactation', type: 'number' },
            { key: 'ageInDays', type: 'number' },
            { key: 'startDateTime', type: 'date' },
            { key: 'reportingDateTime', type: 'date' },
        ];

        const typeSpecificFields: { [key: string]: FieldDefinition[] } = {
            'systemHealth': [
                { key: 'healthIndex', type: 'number' },
                { key: 'endDate', type: 'date' },
                { key: 'minValueDateTime', type: 'date' },
            ],
            'distress': [
                { key: 'alertType', type: 'text' },
                { key: 'duration', type: 'number' },
                { key: 'originalStartDateTime', type: 'date' },
                { key: 'endDateTime', type: 'date' },
                { key: 'daysInPregnancy', type: 'number' },
            ],
            'changeGroup': [
                { key: 'newGroupId', type: 'number' },
                { key: 'newGroupName', type: 'text' },
                { key: 'currentGroupId', type: 'number' },
                { key: 'currentGroupName', type: 'text' },
            ],
            'calving': [
                { key: 'destinationGroup', type: 'number' },
                { key: 'destinationGroupName', type: 'text' },
                { key: 'calvingEase', type: 'text' },
                { key: 'daysInPregnancy', type: 'number' },
                { key: 'oldLactationNumber', type: 'number' },
                { key: 'newborns', type: 'text' },
            ],
            'herdEntry': [
                { key: 'destinationGroup', type: 'number' },
                { key: 'destinationGroupName', type: 'text' },
                { key: 'cowEntryStatus', type: 'text' },
            ],
            'birth': [
                { key: 'birthDateCalculated', type: 'checkbox' },
            ],
            'breeding': [
                { key: 'sire', type: 'text' },
                { key: 'breedingNumber', type: 'number' },
                { key: 'isOutOfBreedingWindow', type: 'checkbox' },
                { key: 'interval', type: 'number' },
            ],
            'systemHeat': [
                { key: 'heatIndexPeak', type: 'number' },
            ],
            'dryOff': [
                { key: 'destinationGroup', type: 'number' },
                { key: 'destinationGroupName', type: 'text' },
                { key: 'daysInPregnancy', type: 'number' },
            ]
        };

        return [
            ...commonFields,
            ...(typeSpecificFields[item.type] || [])
        ];
    }


}