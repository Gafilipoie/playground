import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// Pipes
import { CmmdcPipe } from '../../shared/pipes/cmmdc.pipe';
import { ModuloPipe } from '../../shared/pipes/modulo.pipe';

@Component({
    templateUrl: './rsa.component.html',
    styleUrls: [ './rsa.component.scss' ]
})
export class RsaComponent implements OnInit {
    rsa_m: number;
    rsa_p: number;

    constructor(
        private cmmdc: CmmdcPipe,
        private modulo: ModuloPipe) {}

    ngOnInit() {
        this.rsa();
    }

    // onSubmit(ngForm: NgForm) {
    //     this.rsa_m = ngForm.form.value.rsa_message;
    //     this.rsa_p = ngForm.form.value.rsa_base;
    //     ngForm.form.reset();
    // }

    multiPowRsa() {
        console.log("----------------Multi-pow RSA-------------------");
        let e = 5;

        let p = 3;
        let q = 5;

        let n = Math.pow(p, 2) * q;
        console.log(`n: ${n}`);

        let fi = p * (p - 1) * (q - 1);
        console.log(`fi: ${fi}`);

        let modularInverse = (a: number, m: number): number => {
            let [g, x, y]: number[] = this.cmmdc.transform(a, m);
            if (g != 1) {
                throw "Nu exista invers modular";
            }
            return this.modulo.transform(x, m); // x % m
        }
        let d = modularInverse(e, fi);
        console.log(`d: ${d}`);

        let plainText = Math.floor(Math.random() * (n - 1));
        console.log(`plainText: ${plainText}`);

        let cryptoText = this.modulo.transform(Math.pow(plainText, e), n);
        console.log(`cryptoText: ${cryptoText}`);

        let decryptedText = this.modulo.transform(Math.pow(cryptoText, d), n);
        console.log(`decryptedText: ${decryptedText}`);
    }

    rsa() {
        this.multiPowRsa();
    }
}
