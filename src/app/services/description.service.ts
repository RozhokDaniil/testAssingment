import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

  getDisplayValue(item: any): { key: string, value: string } {
    if (item.newGroupName !== undefined) {
      return { key: 'New Group', value: item.newGroupName };
    } else if (item.heatIndexPeak !== undefined) {
      return { key: 'Heat Index Peak', value: item.heatIndexPeak.toString() };
    } else if (item.cowEntryStatus !== undefined) {
      return { key: 'Cow Entry Status', value: item.cowEntryStatus.toString() };
    } else if (item.duration !== undefined) {
      return { key: 'Duration', value: item.duration.toString() };
    } else if (item.lactationNumber !== undefined) {
      return { key: 'Lactation Number', value: item.lactationNumber.toString() };
    } else {
      return { key: 'No Data', value: 'No Data' };
    }
  }

  parseDescription(item: any, description: string): void {
    const [key, value] = description.split(': ').map(s => s.trim());
    switch (key) {
      case 'New Group':
        item.newGroupName = value;
        break;
      case 'Heat Index Peak':
        item.heatIndexPeak = value;
        break;
      case 'Cow Entry Status':
        item.cowEntryStatus = value;
        break;
      case 'Duration':
        item.duration = parseInt(value, 10);
        break;
      case 'Lactation Number':
        item.lactationNumber = parseInt(value, 10);
        break;
      default:
        break;
    }
  }
}
