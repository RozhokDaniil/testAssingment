import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { CommonEvent } from '../modules/table.modules';

@Injectable({
    providedIn: 'root'
})
export class DataManagementService {
    private data: CommonEvent[] = [];

    constructor(private fetchDataService: FetchDataService) {
        this.loadData();
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
}