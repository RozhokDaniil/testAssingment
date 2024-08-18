import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'camelCaseSplit' })
export class CamelCasePipe implements PipeTransform {

    transform(camelCase: string): string {
        let ccSplit = camelCase.split(/(?=[A-Z])/).join(" ");
        
        if (ccSplit.length > 0) {
          ccSplit = ccSplit.charAt(0).toUpperCase() + ccSplit.slice(1);
        }
        
        return ccSplit;
    }
}