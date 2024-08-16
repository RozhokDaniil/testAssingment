import { Injectable } from '@angular/core';
import { DataManagementService } from './management-data.service';
import { CommonEvent } from '../modules/table.modules';

@Injectable({
    providedIn: 'root'
})
export class DescriptionService {
    private data: CommonEvent[] = [];

    constructor(private dataManagementService: DataManagementService) {
        this.data === this.dataManagementService.getData()
    }

    getDisplayValue(item: any): { key: string, value: string } {
        const fields = this.data[item.type] || [];
        for (const field of fields as any) {
            if (item[field] !== undefined) {
                return { key: this.capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1')), value: item[field].toString() };
            }
        }
        return { key: 'No Data', value: 'No Data' };
    }

    parseDescription(item: any, description: string): void {
        const [key, value] = description.split(': ').map(s => s.trim());
        const field = this.getFieldFromKey(key);
        if (field && item.hasOwnProperty(field)) {
            item[field] = isNaN(Number(value)) ? value : Number(value);
        }
    }

    private getFieldFromKey(key: string): string | undefined {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
        for (const [eventType, fields] of Object.entries(this.data)) {
            for (const field of fields as any) {
                if (this.capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1')).toLowerCase() === normalizedKey) {
                    return field;
                }
            }
        }
        return undefined;
    }

    private capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
