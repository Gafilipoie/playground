import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toBase'})
export class ToBasePipe implements PipeTransform {
    transform(m: number, p: number): number[] {
        let number: number = m;
        let base: number = p;
        let result: number[] = [];

        if (number % base == 0) {
            result.splice(result.length, 0, 0);
            number = 0;
        }

        while (number > 0) {
            if (number % base == 0) {
                number = Math.floor(number / base);
            } else {
                result.splice(result.length, 0, number % base);
                number = Math.floor(number / base);
            }
        }

        return result.reverse();
    }
}
