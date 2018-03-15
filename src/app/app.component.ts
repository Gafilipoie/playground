import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// Services
import { EncryptService } from './shared/services/encrypt.service';
import { DecryptService } from './shared/services/decrypt.service';

// Pipes
import { ToBasePipe } from './shared/pipes/toBase.pipe';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    rs_m: number;
    rs_s: number;
    rs_p: number;
    rs_m_to_encrypt: number[];
    rs_encrypted: number[];
    rs_encrypted_with_error: number[];
    rs_decrypted:number[];

    constructor(
        private encrypt: EncryptService,
        private decrypt: DecryptService,
        private toBase: ToBasePipe) {}

    ngOnInit() {}

    onSubmit(ngForm) {
        this.rs_m = ngForm.form.value.rs_message;
        this.rs_s = ngForm.form.value.rs_s;
        this.rs_p = ngForm.form.value.rs_base;
        ngForm.form.reset();
        this.reedSolomon(this.rs_m, this.rs_s, this.rs_p);
    }

    reedSolomon(m: number, s: number, p: number) {
        this.rs_m_to_encrypt = this.toBase.transform(m, p);
        console.log(`m(${this.rs_m_to_encrypt}) in base p(11): [${this.rs_m_to_encrypt.toString()}]`);

        this.rs_encrypted = this.encrypt.init(this.rs_m_to_encrypt, s, p);
        console.log(`Encrypted Message: [${this.rs_encrypted.toString()}]`);

        this.rs_encrypted_with_error = JSON.parse(JSON.stringify(this.rs_encrypted));
        this.rs_encrypted_with_error[1] = 2;
        console.log(`Message with error: [${this.rs_encrypted_with_error.toString()}]`);

        this.rs_decrypted = this.decrypt.init(this.rs_encrypted_with_error, p);
        console.log(`Decrypted Message: [${this.rs_decrypted.toString()}]`);
    }
}
