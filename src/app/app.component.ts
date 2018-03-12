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

    constructor(
        private encrypt: EncryptService,
        private decrypt: DecryptService,
        private toBase: ToBasePipe) {}

    ngOnInit() {
        this.reedSolomon();
    }

    reedSolomon() {
        let message: number = 29;
        let s: number = 1;
        let p: number = 11;

        let m: number[] = this.toBase.transform(message, p);
        console.log(`m(29) in base p(11): [${m.toString()}]`);

        let encrypted: number[] = this.encrypt.init(m, s, p);
        console.log(`Encrypted Message: [${encrypted.toString()}]`);

        encrypted[1] = 2;
        console.log(`Message with error: [${encrypted.toString()}]`);

        let decrypted = this.decrypt.init(encrypted, p);
        console.log(`Decrypted Message: [${decrypted.toString()}]`);
    }
}
