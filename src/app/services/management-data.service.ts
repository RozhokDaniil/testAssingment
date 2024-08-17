import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { CommonEvent } from '../modules/table.modules';
import { removeDuplicateKeysAndLength } from '../utils/removeDuplicateKeysAndLength';

@Injectable({
    providedIn: 'root'
})
export class DataManagementService {
    private data: CommonEvent[] = [];
    
    constructor(private fetchDataService: FetchDataService) {
        this.loadData();
        this.checkDataDeps()
        // this.checkDataDeps2()
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

    private checkDataDeps2() {
        // console.log('1111')
        const fieldCounts = this.data.reduce((counts: any, obj) => {
            Object.keys(obj).forEach(key => {
                counts[key] = (counts[key] || 0) + 1;
            });
            return counts;
        }, {});
        const exceptFields = Object.keys(fieldCounts).filter(key => fieldCounts[key] !== this.data.length);
        const depsArr = this.data.map((item: any) => {
            const listOfExceptFields = exceptFields.filter((field: any) => item[field] !== undefined)
            return { [item.type]: listOfExceptFields }
        })
        // console.log(removeDuplicateKeysAndLength(depsArr), 'depsArr')
        return removeDuplicateKeysAndLength(depsArr)
    }
    
    checkDataDeps() {
        // console.log('checkDataDeps called')
        type KeyedArray = { [key: string]: any[] };
        // console.log('1111');
        const fieldCounts = this.data.reduce((counts: any, obj: any) => {
            Object.keys(obj).forEach(key => {
                counts[key] = (counts[key] || 0) + 1;
            });
            return counts;
        }, {});
        const exceptFields = Object.keys(fieldCounts).filter(key => fieldCounts[key] !== this.data.length);
        const depsArr = this.data.map((item: any) => {
            const listOfExceptFields = exceptFields.filter((field: any) => item[field] !== undefined);
            return { [item.type]: listOfExceptFields };
        });
        const uniqueDepsArr = removeDuplicateKeysAndLength(depsArr);
        const result: KeyedArray = uniqueDepsArr.reduce((acc: any, obj: any) => {
            const key = Object.keys(obj)[0];
            acc[key] = obj[key];
            return acc;
        }, {});
    
        // console.log(result, 'depsArr11');
        return result;
    }
    
}