import { Injectable } from '@angular/core';

// Pipes
import { ModuloPipe } from '../pipes/modulo.pipe';
import { RangePipe } from '../pipes/range.pipe';

@Injectable()
export class EncryptService {

    constructor(
        private modulo: ModuloPipe,
        private range: RangePipe) {}

    init(m: number[], s: number, p: number): number[] {
        let k: number = m.length + 1;
        let n: number = k + 2 * s;
        let result: number[] = [];

        let polynom = (m: number[], x: number, p: number): number => {
            let result: number = m[0];
            for (let i of m.slice(1)) {
                result = result * x + i;
            }
            result *= x;
            return this.modulo.transform(result, p);
        };

        for (let i of this.range.transform(1, n)) {
            result.push(polynom(m, i, p));
        }

        return result;
    }
}
