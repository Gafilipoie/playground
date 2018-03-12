import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'cmmdc'})
export class CmmdcPipe implements PipeTransform {
    transform(a: number, b: number): number[] {
        if (a == 0) return [b, 0, 1];
        let [g, y, x]: number[] = this.transform(b % a, a);
        return [g, x - (Math.floor(b / a)) * y, y]
    }
}
