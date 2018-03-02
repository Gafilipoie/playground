import { Component, OnInit } from '@angular/core';
import { CharCodePipe, FromCharCodePipe, ArrayFillPipe, SliceStepPipe } from './shared/pipes/utilities.pipe';

import { GaloisFieldService } from './shared/services/galoisField.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ GaloisFieldService, CharCodePipe, FromCharCodePipe, ArrayFillPipe, SliceStepPipe ]
})
export class AppComponent implements OnInit {
    message: string;
    messageArray: string[];
    s: number;
    encryptedMessage: number[];

    constructor(
        private galoisField: GaloisFieldService,
        private charCode: CharCodePipe,
        private fromCharCode: FromCharCodePipe,
        private arrayFill: ArrayFillPipe,
        private sliceStep: SliceStepPipe) {}

    ngOnInit() {
        this.message = 'Hello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello World';
        this.s = 1;
        this.messageArray = this.message.split('');

        for(let i = 0; i < this.s * 2; i++) {
            this.messageArray.push(`p${i}`);
        }

        this.encryptedMessage = this.encrypt(this.message, this.s);
    }

    encrypt(msg: string, s: number) {
        let k: number[] = this.charCode.transform(msg);
        let parity: number = 2 * s;
        let n: number = k.length + parity;
        console.log(`Encrypt Message '${msg}' with a length of ${k.length} where a parity length of ${parity} is added`);

        // Each codeword contains 255 code word bytes, of which 223 bytes are data and 32 bytes are parity
        let blockSize: number = 255 - parity;
        let enc: number[] = [];

        for (let i = 0; i < k.length; i += blockSize) {
            let block = k.slice(i, i + blockSize);
            enc = enc.concat(this.encodeMsg(block, parity))
        }

        return enc;
    }

    encodeMsg(msgIn: number[], parity: number) {
        if (msgIn.length + parity > 255)
            throw 'Message too long.';

        let gen: number[] = this.generatePolinom(parity);
        let msgOut: number[] = this.arrayFill.transform(msgIn.length + parity, 0);

        for (let i = 0; i < msgIn.length; i++) {
            msgOut[i] = msgIn[i];
        }

        for (let i = 0; i < msgIn.length; i++) {
            let coef: number = msgOut[i];
            if (coef != 0) {
                for (let j = 0; j < gen.length; j++) {
                    msgOut[i + j] ^= this.galoisField.mul(gen[j], coef);
                }
            }
        }

        for (let i = 0; i < msgIn.length; i++) {
            msgOut[i] = msgIn[i];
        }

        return msgOut;
    }

    generatePolinom(parity: number) {
        let g: number[] = [1];

        for (let i = 0; i < parity; i++) {
            g = this.galoisField.polyMul(g, [1, this.galoisField.gfExp[i]]);
        }

        return g;
    }
}
