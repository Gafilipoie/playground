import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app'

    constructor() {}

    ngOnInit() {
        this.encrypt('Hello World', 1);
    }

    encrypt(msg: string, s: number) {
        let k: number[] = this.getCharCodes(msg);
        let parity: number = 2 * s;
        let n: number = k.length + parity;
        console.log(`Encrypt Message '${msg}' with a length of ${k.length} where a parity length of ${parity} is added`);
        console.log(`n = k + 2 * s => n = ${k.length} + 2 * ${s} => n = ${k.length + 2 * s}`);
        // Each codeword contains 255 code word bytes, of which 223 bytes are data and 32 bytes are parity
        let blockSize: number = 255 - parity;
        let enc: number[] = [];

        for (let i = 0; i < k.length; i += blockSize) {
            let block = k.slice(i, i + blockSize);
            //AM RAMAS AICI
        }

        return enc;
    }

    getCharCodes(msg: string) {
        let charCodes: number[] = [];

        for(let i = 0; i < msg.length; i++) {
            charCodes.push(msg.charCodeAt(i));
        }

        return charCodes;
    }
}
