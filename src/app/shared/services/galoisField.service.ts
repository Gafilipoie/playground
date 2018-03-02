import { Injectable } from '@angular/core';
import { ArrayFillPipe } from '../pipes/utilities.pipe';

@Injectable()
export class GaloisFieldService {
    gfExp: number[] = this.arrayFill.transform(512, 1);
    gfLog: number[] = this.arrayFill.transform(256, 0);

    constructor(private arrayFill: ArrayFillPipe) {
        let x: number = 1;

        for (let i = 1; i < 255; i++) {
            x <<= 1;
            if (x & 0x100)  x ^= 0x11d;
            this.gfExp[i] = x;
            this.gfLog[x] = i;
        }

        for (let i = 255; i < 512; i++) {
            this.gfExp[i] = this.gfExp[i - 255];
        }
    }

    mul(x, y) {
        if (x == 0 || y == 0) return 0;
        return this.gfExp[this.gfLog[x] + this.gfLog[y]];
    }

    polyMul(p, q) {
        let r = this.arrayFill.transform(p.length + q.length - 1, 0);

        for (let j = 0; j < q.length; j++) {
            for (let i = 0; i < p.length; i++) {
                r[i + j] ^= this.mul(p[i], q[j]);
            }
        }

      return r;
    }
}
