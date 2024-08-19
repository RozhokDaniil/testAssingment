import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unixTimestamp' })
export class UnixTimestampPipe implements PipeTransform {
  transform(value: string | number): string {
    if (typeof value === 'number') {
      return this.convertTimestampToDate(value);
    } else if (typeof value === 'string') {
      const timestamp = this.convertDateStringToTimestamp(value);
      if (timestamp !== null) {
        return this.convertTimestampToDate(timestamp);
      }
      return this.convertDateStringToReadableDate(value);
    }
    return 'Invalid input';
  }

  private convertTimestampToDate(timestamp: number): string {
    if (!timestamp) return 'Invalid timestamp';
    const date = new Date(timestamp * 1000);
    return this.formatDate(date);
  }

  private convertDateStringToTimestamp(dateString: string): number | null {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        return Math.floor(date.getTime() / 1000);
      }
    }
    return null;
  }

  private convertDateStringToReadableDate(dateString: string): string {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return this.formatDate(date);
    }
    return 'Invalid date';
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, // For 12-hour format with AM/PM
    };
    return date.toLocaleDateString('en-US', options) 
  }
}