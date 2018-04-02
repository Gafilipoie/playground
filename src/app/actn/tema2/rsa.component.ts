import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

// Pipes
import { CmmdcPipe } from '../../shared/pipes/cmmdc.pipe';
import { ModuloPipe } from '../../shared/pipes/modulo.pipe';
import { RangePipe } from '../../shared/pipes/range.pipe';

declare var bigInt: any;

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
        this.rsa(16);
    }

    // onSubmit(ngForm: NgForm) {
    //     this.rsa_m = ngForm.form.value.rsa_message;
    //     this.rsa_p = ngForm.form.value.rsa_base;
    //     ngForm.form.reset();
    // }

    isPrime(num: number, test_count: number) {
        if (num == 1) return false;
        if (test_count >= num) test_count = num - 1;

        for (let i of this.range.transform(0, test_count)) {
            let val: number = bigInt.randBetween(num - 1, 1);
            if (bigInt(val).modPow(num - 1, num) != 1) return false
        }

        return true;
    }

    primeWithBits(n: number) {
        let isPrime: boolean = false;
        while (!isPrime) {
            let p: number = bigInt.randBetween(bigInt(2).pow(n), bigInt(2).pow(n - 1));
            if (this.isPrime(p, 1000)) {
                return p;
            }
        }
    }

    modularInverse(a: number, m: number) {
        let [g, x, y]: number[] = this.cmmdc.transform(a, m);
        if (g != 1) {
            throw "Nu exista invers modular";
        }
        return this.modulo.transform(x, m);
    }


    rsaTCR(y: number, d: number, p: number, q: number, r: number) {
        /* yp = (y mod p)^d mod (p-1) mod p */
        let yp: number = bigInt(this.modulo.transform(y, p)).modPow(this.modulo.transform(d, p - 1), p);

        /* yq = (y mod q)^d mod (q-1) mod q */
        let yq: number = bigInt(this.modulo.transform(y, q)).modPow(this.modulo.transform(d, q - 1), q);

        /* yp = (y mod r)^d mod (r-1) mod r */
        let yr: number = bigInt(this.modulo.transform(y, r)).modPow(this.modulo.transform(d, r - 1), r);

        let b_p: number = q * r;
        let b_q: number = p * r;
        let b_r: number = p * q;

        let sol: number = yp * b_p * this.modularInverse(b_p, p) + yq * b_q * this.modularInverse(b_q, q) + yr * b_r * this.modularInverse(b_r, r);
        let n: number = p * q * r;
        sol = this.modulo.transform(sol, n);

        return sol;
    }

    multiPrimeRsa(bits: number) {
        console.log("----------------Multiprime RSA-------------------");
        let e: number = 5;

        let p: number = this.primeWithBits(bits);
        let q: number = this.primeWithBits(bits);
        let r: number = this.primeWithBits(bits);

        /* n = p * q * r */
        let n: number = bigInt(bigInt(p).multiply(q)).multiply(r);
        console.log(`n: ${n}`);

        /* phiN = (p - 1) * (q - 1) * (r - 1) */
        let phiN: number = bigInt(bigInt(p - 1).multiply(q - 1)).multiply(r - 1);
        console.log(`phiN: ${phiN}`);

        /* d = e^(-1) mod n */
        let d: number = this.modularInverse(e, phiN);
        console.log(`d: ${d}`);

        let x: number = Math.floor(Math.random() * (n - 1));
        console.log(`x: ${x}`);

        /* y = x^e mod n */
        let cypher: number = bigInt(x).modPow(e, n);
        console.log(`cypher: ${cypher}`);

        let startTime: any = moment();

        /* x = y^d mod n */
        // let decrypt: number = bigInt(cypher).modPow(d, n);
        let decrypt: number = this.rsaTCR(cypher, d, p, q, r);
        console.log(`decrypt: ${decrypt}`);

        let endTime: any = moment();

        let runningTime: number = endTime.diff(startTime);
        console.log(`Decrypt time: ${runningTime} milliseconds`);
        console.log(`Is x equal to decrypt? ${x == decrypt}`);
    }

    multiPowRsa(bits: number) {
        console.log("----------------Multipow RSA-------------------");
        let e: number = 5;

        let p: number = this.primeWithBits(bits);
        let q: number = this.primeWithBits(bits);

        /* n = p^2 * q */
        let n: number = bigInt(bigInt(p).pow(2)).multiply(q);
        console.log(`n: ${n}`);

        /* phiN = p * (p - 1) * (q - 1) */
        let phiN: number = bigInt(bigInt(p).multiply(p - 1)).multiply(q - 1);
        console.log(`phiN: ${phiN}`);

        /* d = e^(-1) mod n */
        let d: number = this.modularInverse(e, phiN);
        console.log(`d: ${d}`);

        let x: number = Math.floor(Math.random() * (n - 1));
        console.log(`x: ${x}`);

        /* y = x^e mod n */
        let cypher: number = bigInt(x).modPow(e, n);
        console.log(`cypher: ${cypher}`);

        let startTime: any = moment();

        /* x = y^d mod n */
        let decrypt: number = bigInt(cypher).modPow(d, n);
        console.log(`decrypt: ${decrypt}`);

        let endTime: any = moment();

        let runningTime: number = endTime.diff(startTime);
        console.log(`Decrypt time: ${runningTime} milliseconds`);
        console.log(`Is x equal to decrypt? ${x == decrypt}`);
    }

    rsa(bits: number) {
        this.multiPrimeRsa(bits);
        // this.multiPowRsa(bits);
    }
}
