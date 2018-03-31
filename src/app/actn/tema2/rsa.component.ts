import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// Pipes
import { CmmdcPipe } from '../../shared/pipes/cmmdc.pipe';
import { ModuloPipe } from '../../shared/pipes/modulo.pipe';
import { RangePipe } from '../../shared/pipes/range.pipe';

@Component({
    templateUrl: './rsa.component.html',
    styleUrls: [ './rsa.component.scss' ]
})
export class RsaComponent implements OnInit {
    rsa_m: number;
    rsa_p: number;

    constructor(
        private cmmdc: CmmdcPipe,
        private modulo: ModuloPipe,
        private range: RangePipe) {}

    ngOnInit() {
        this.rsa();
    }

    // onSubmit(ngForm: NgForm) {
    //     this.rsa_m = ngForm.form.value.rsa_message;
    //     this.rsa_p = ngForm.form.value.rsa_base;
    //     ngForm.form.reset();
    // }

    isPrime(num: number, test_count: number) {
        if (num == 1) return false;
        if (test_count >= num) test_count = num - 1;

        for (let i of this.range.transform(1, test_count)) {
            let val: number = bigInt.randBetween(num - 1, 1);
            if (bigInt(val).modPow(num - 1, num) != 1) return false
        }

        return true;
    }

    primeWithBits(n: number) {
        let isPrime: boolean = false;
        while (!isPrime) {
            let p: number = bigInt.randBetween(bigInt(2).pow(n), bigInt(2).pow(n - 1));
            if this.isPrime(p, 1000) {
                return p;
            }
        }
    }

    multiPowRsa() {
        console.log("----------------Multi-pow RSA-------------------");
        let p = this.primeWithBits(16);
        let q = this.primeWithBits(16);

        let n = Math.pow(p, 2) * q;
        console.log(`n: ${n}`);

        let phiN = p * (p - 1) * (q - 1);
        console.log(`phiN: ${phiN}`);

        let modularInverse = (a: number, m: number): number => {
            let [g, x, y]: number[] = this.cmmdc.transform(a, m);
            if (g != 1) {
                throw "Nu exista invers modular";
            }
            return this.modulo.transform(x, m);
        }

        let e = 5;
        let d = modularInverse(e, phiN);
        console.log(`d: ${d}`);

        let x = Math.floor(Math.random() * (n - 1));
        console.log(`x: ${x}`);

        let cypher = bigInt(x).modPow(e, n);
        console.log(`cypher: ${cypher}`);

        let startTime: any = performance.now();

        let decrypt = bigInt(cypher).modPow(d, n);
        console.log(`decrypt: ${decrypt}`);

        let endTime: any = performance.now();

        let runningTime: any = endTime - startTime;
        console.log(`Decrypt time: ${runningTime}`);
    }

    rsa() {
        this.multiPowRsa();
    }
}
