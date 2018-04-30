import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'randomRange'})
export class RandomRangePipe implements PipeTransform {
    transform(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
