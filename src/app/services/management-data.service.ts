import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service'; 

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
      return this.fetchDataService.postData(item)
    }
  
    updateItem(item: any) {
      return this.fetchDataService.putData(item)
    }
  
    deleteItem(id: number) {
      return this.fetchDataService.deleteData(id)
    }
  }