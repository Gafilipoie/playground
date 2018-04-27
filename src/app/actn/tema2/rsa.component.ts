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
    n: number;
    phiN: number;
    modInv: string;
    d: number;
    x: number;
    cypher: number;
    decrypt: number;
    decryptTime: number;
    runningTime: number;
    onMultiPrimeRsa: boolean;
    onMultiPowRsa: boolean;

    constructor(
        private cmmdc: CmmdcPipe,
        private modulo: ModuloPipe,
        private range: RangePipe) {}

    ngOnInit() {}

    emptyTable() {
        this.n = undefined;
        this.phiN = undefined;
        this.modInv = undefined;
        this.d = undefined;
        this.x = undefined;
        this.cypher = undefined;
        this.decrypt = undefined;
        this.decryptTime = undefined;
    }

    onSubmit(ngForm: NgForm) {
        this.emptyTable();
        if (this.onMultiPrimeRsa) this.multiPrimeRsa(ngForm.form.value.rsa_bits);
        if (this.onMultiPowRsa) this.multiPowRsa(ngForm.form.value.rsa_bits);
        this.onMultiPrimeRsa = false;
        this.onMultiPowRsa = false;
    }

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
            this.modInv = 'Modular Inverse does not exist!';
            throw this.modInv;
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
        let e: number = 5;

        let p: number = this.primeWithBits(bits);
        let q: number = this.primeWithBits(bits);
        let r: number = this.primeWithBits(bits);

        /* n = p * q * r */
        this.n = bigInt(bigInt(p).multiply(q)).multiply(r);

        /* phiN = (p - 1) * (q - 1) * (r - 1) */
        this.phiN = bigInt(bigInt(p - 1).multiply(q - 1)).multiply(r - 1);

        /* d = e^(-1) mod n */
        this.d = this.modularInverse(e, this.phiN);

        this.x = Math.floor(Math.random() * (this.n - 1));

        /* y = x^e mod n */
        this.cypher = bigInt(this.x).modPow(e, this.n);

        let startTime: any = moment();

        /* x = y^d mod n */
        // this.decrypt = bigInt(this.cypher).modPow(this.d, this.n);
        this.decrypt = this.rsaTCR(this.cypher, this.d, p, q, r);

        let endTime: any = moment();

        this.runningTime = endTime.diff(startTime);
    }

    multiPowRsa(bits: number) {
        let e: number = 5;

        let p: number = this.primeWithBits(bits);
        let q: number = this.primeWithBits(bits);

        /* n = p^2 * q */
        this.n = bigInt(bigInt(p).pow(2)).multiply(q);

        /* phiN = p * (p - 1) * (q - 1) */
        this.phiN = bigInt(bigInt(p).multiply(p - 1)).multiply(q - 1);

        /* d = e^(-1) mod n */
        this.d = this.modularInverse(e, this.phiN);

        this.x = Math.floor(Math.random() * (this.n - 1));

        /* y = x^e mod n */
        this.cypher = bigInt(this.x).modPow(e, this.n);

        let startTime: any = moment();

        /* x = y^d mod n */
        this.decrypt = bigInt(this.cypher).modPow(this.d, this.n);

        let endTime: any = moment();

        this.runningTime = endTime.diff(startTime);
    }
}
