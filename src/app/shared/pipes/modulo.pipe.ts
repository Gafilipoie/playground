import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'modulo'})
export class ModuloPipe implements PipeTransform {
    transform(x: number, y: number): number {
        return (x % y + y) % y;
    }
}
