import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { catchError, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataManagementService {
    private data: any[] = [];

    constructor(private fetchDataService: FetchDataService) {
        this.loadData();
    }

    private loadData(): void {
        this.fetchDataService.getData().subscribe({
            next: (data: any[]) => this.data = data,
            error: (err) => console.error('Error loading data', err)
        });
    }

    getData(): any[] {
        return this.data;
    }

    addItem(item: any) {
        item.eventId = this.getNextId();
        item.startDateTime = new Date().toISOString();

        return this.fetchDataService.postData(item)
    }

    updateItem(item: any) {
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