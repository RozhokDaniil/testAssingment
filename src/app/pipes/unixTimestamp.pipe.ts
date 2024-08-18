import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unixTimestamp' })
export class UnixTimestampPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '';
    const date = new Date(value * 1000);
    return date.toLocaleDateString('en-US') + ' ' + date.toLocaleTimeString('en-US');
  }
}