import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'minutesFormat'
})
export class MinutesFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      return 'Invalid time';
    }

    const hours = Math.floor(value / 60);
    const minutes = Math.floor(value % 60);

    const hoursFormatted = hours.toString().padStart(1, '0');
    const minutesFormatted = minutes.toString().padStart(2, '0');

    return `${hoursFormatted}:${minutesFormatted}`;
  }
}
