import { Injectable } from '@angular/core';
import { DataManagementService } from './management-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class DescriptionService {
    private dataDeps: any;
    private fb: FormBuilder;

    constructor(private dataManagementService: DataManagementService, fb: FormBuilder) {
        this.dataDeps = this.dataManagementService.checkDataDeps(),
            this.fb = fb;
    }

    initializeForm(item: any, isEdit: boolean): FormGroup {
        const requiredFields = ['type', 'cowId', 'animalId']
        if (!isEdit) {
            let commonFieldsObj = this.dataManagementService.commonFields.reduce((obj: any, field) => {
                obj[field] = item[field];
                return obj;
            }, {});
            item = { ...commonFieldsObj, type: item.type }
        }

        let displayArr = this.getDisplayValues(item);
        const form = this.fb.group({});
        displayArr.forEach((display: any) => {
            form.addControl(display.key, this.fb.control(display.value || ''));
        });
        Object.keys(item).forEach(key => {
            if (this.dataManagementService.commonFields.includes(key)
            ) {
                if(requiredFields.includes(key)){
                    form.addControl(key, this.fb.control(item[key] || '', Validators.required));
                } else {
                    form.addControl(key, this.fb.control(item[key] || ''));

                }

            }
        });
        return form
    }

    getDisplayValue(item: any): { key: string, value: string } {
        const exceptFields = this.dataManagementService.exceptFields
        for (let i = 0; i < exceptFields.length; i++) {
            const key = exceptFields[i]
            const value = item[key]
            if (key && value) {
                return { key, value: item[key] };
            }
        }
        return { key: 'No Data', value: 'No Data' };
    }

    getDisplayValues(item: any, isEdit?: boolean): any {
        const fields = this.dataDeps[item.type] || [];
        let arr = []
        for (const field of fields as any) {
            arr.push({ key: field, value: item[field] });
        }
        return arr.length ? arr : isEdit ? [{ key: 'No Data', value: 'No Data' }] : []; // for addItem
    }

    parseDescription(item: any, descriptions: { key: string, value: any }[]): void {
        const itemMap = new Map(Object.entries(item));

        descriptions.forEach(description => {
            const { key } = description;
            const field = this.getFieldFromKey(key);

            if (field && itemMap.has(field)) {
                description.value = itemMap.get(field);
            } else {
                description.value = null;
            }
        });
    }

    private getFieldFromKey(key: string): string | undefined {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
        for (const [eventType, fields] of Object.entries(this.dataDeps)) {
            for (const field of fields as any) {
                const normalizedField = field.toLowerCase().replace(/\s+/g, '');
                if (normalizedField === normalizedKey) {
                    return field;
                }
            }
        }
        return undefined;
    }

    // private capitalizeFirstLetter(string: string): string {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // }
}
