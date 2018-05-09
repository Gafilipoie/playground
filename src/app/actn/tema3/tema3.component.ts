import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// Pipes\
import { ModuloPipe } from '../../shared/pipes/modulo.pipe';
import { RangePipe } from '../../shared/pipes/range.pipe';
import { RandomRangePipe } from '../../shared/pipes/random_range.pipe';

declare var bigInt: any;

@Component({
    templateUrl: './tema3.component.html',
    styleUrls: [ './tema3.component.scss' ]
})
export class Tema3Component implements OnInit {

	constructor(
        private modulo: ModuloPipe,
        private range: RangePipe,
        private randomRange: RandomRangePipe) {}

    ngOnInit() {}

    onSubmit(ngForm: NgForm) {
        console.log("Jacobi symbol for 4/5", this.legendre(4, 5));
        console.log("Jacobi symbol for 30/59", this.legendre(30, 59));
        console.log("Solovay-Strassen primality test for 3097", this.solovayStrassen(3097, 15));
        console.log("Solovay-Strassen primality test for 37", this.solovayStrassen(37, 15));

        console.log("Lucas-Lehmer primality test for Mersenne number 11", this.testLucas(11));
        console.log("Lucas-Lehmer primality test for Mersenne number 31", this.testLucas(31));
        console.log("Lucas-Lehmer primality test for Mersenne number 127", this.testLucas(127));
        console.log("Lucas-Lehmer primality test for Mersenne number 2047", this.testLucas(2047));
        console.log("Lucas-Lehmer primality test for Mersenne number 8191", this.testLucas(8191));
    }

    /* Problema 1 */
    solovayStrassen(n: number, k: number = 10) {
        if (n == 2) return true;
        if (!(n & 1)) return false;
        for (let i of this.range.transform(0, k)) {
            let a: number = this.randomRange.transform(2, n - 1);
            let x: number = this.legendre(a, n);
            let y: number = bigInt(a).modPow(Math.floor((n - 1) / 2), n);
            if (x == 0 || y != this.modulo.transform(x, n)) return false;
        }

        return true;
    }

    legendre(a: number, p: number) {
        let r: number;

        if (p < 2) throw 'p must not be < 2';
        if (a == 0 || a == 1) return a;

        if (this.modulo.transform(a, 2) == 0) {
            r = this.legendre(Math.floor(a / 2), p);
            if ((p * p - 1 & 8) != 0) r *= -1;
        } else {
            r = this.legendre(this.modulo.transform(p, a), a);
            if (((a - 1) * (p - 1) & 4) != 0) r *= -1;
        }

        return r;
    }

    /* Problema 2 */
    testLucas(n: number) {
        let mersenneNr: number = this.mersenneNumber(n);
        if (mersenneNr == -1) return 'Number is not Mersenne Number';

        return this.lucasLehmer(mersenneNr);
    }

    mersenneNumber(n: number) {
        let factors: number[] = this.nFactors(n + 1);
        for (let i of factors) {
            if (i != 2) return -1;
        }
        return factors.length;
    }

    nFactors(n: number) {
        let result = [];
        let nr: number = n;
        while(nr > 1) {
            for (let i of this.range.transform(2, nr + 1)) {
                if (this.modulo.transform(nr, i) == 0) {
                    nr = Math.floor(nr / i);
                    result.push(i);
                    break;
                }
            }
        }
        return result;
    }

    lucasLehmer(p: number) {
        let s = 4;
        let M = Math.pow(2, p) - 1;

        for (let i of this.range.transform(0, p - 2)) {
            s = this.modulo.transform((s * s) - 2, M);
        }

        if (s == 0) {
            return true;
        } else {
            return false;
        }
    }
}
