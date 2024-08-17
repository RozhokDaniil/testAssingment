import { Injectable } from '@angular/core';
import { DataManagementService } from './management-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class DescriptionService {
    private dataDeps: any //dataDeps
    private fb: FormBuilder;

    constructor(private dataManagementService: DataManagementService, fb: FormBuilder) {
        this.dataDeps = this.dataManagementService.checkDataDeps(),
            this.fb = fb;
    }

    initializeForm(item: any): FormGroup {
        let displayArr = this.getDisplayValues(item);
        const form = this.fb.group({});
        displayArr.forEach((display: any) => {
            form.addControl(display.key, this.fb.control(display.value || ''));
        });
        return form;
    }

    getDisplayValue(item: any): { key: string, value: string } {
        const exceptFields = this.dataManagementService.exceptFields
        for(let i = 0; i < exceptFields.length; i++){
            const key = exceptFields[i]
            const value = item[key]
            if(key && value){
                return { key: key.replace(/([A-Z])/g, ' $1'), value: item[key] };
            }
        }
        return { key: 'No Data', value: 'No Data' };
    }

    getDisplayValues(item: any): any {
        const fields = this.dataDeps[item.type] || [];
        let arr = []
        for (const field of fields as any) {
            // if (typeof item[field] === 'boolean') {
            arr.push({ key: this.capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1')), value: item[field] });
            // }
        }
        return arr.length ? arr : [{ key: 'No Data', value: 'No Data' }];
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
        for (const [eventType, fields] of Object.entries(this.dataDeps)) {
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
