import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { CommonEvent } from '../modules/table.modules';
import { removeDuplicateKeysAndLength } from '../utils/removeDuplicateKeysAndLength';

@Injectable({
    providedIn: 'root'
})
export class DataManagementService {
    private data: CommonEvent[] = [];
    exceptFields: string[] = []
    eventTypes: string[] = []
    
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
        item.startDateTime = new Date().toISOString();

        return this.fetchDataService.postData(item)
    }

    updateItem(item: CommonEvent) {
        return this.fetchDataService.putData(item)
    }

    deleteItem(id: number) {
        return this.fetchDataService.deleteData(id)
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
    
}