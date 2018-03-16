import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    templateUrl: './rsa.component.html',
    styleUrls: [ './rsa.component.scss' ]
})
export class RsaComponent implements OnInit {
    rsa_m: number;
    rsa_p: number;

    constructor() {}

    ngOnInit() {}

    onSubmit(ngForm: NgForm) {
        this.rsa_m = ngForm.form.value.rsa_message;
        this.rsa_p = ngForm.form.value.rsa_base;
        ngForm.form.reset();
    }
}
