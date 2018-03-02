import { Pipe, PipeTransform } from '@angular/core';

/* unpack */
@Pipe({name: 'charCode'})
export class CharCodePipe implements PipeTransform {
    public transform(data: string) {
        let charCodes: number[] = [];

        for(let i = 0; i < data.length; i++) {
            charCodes.push(data.charCodeAt(i));
        }

        return charCodes;
    }
}

/* pack */
@Pipe({name: 'fromCharCode'})
export class FromCharCodePipe implements PipeTransform {
    public transform(charCodes: number[]) {
        let chars: string[] = [];

        for(let i = 0; i < charCodes.length; i++) {
          chars.push(String.fromCharCode(charCodes[i]));
        }

        return chars.join('');
    }
}

/* arrayFill */
@Pipe({name: 'arrayFill'})
export class ArrayFillPipe implements PipeTransform {
    public transform(size: number, value: number) {
        return Array.apply(null, new Array(size))
          .map(function () { return value; });
    }
}

/* sliceStep */
@Pipe({name: 'sliceStep'})
export class SliceStepPipe implements PipeTransform {
    public transform(array, from, to, step) {
        let result = Array.prototype.slice.call(array, from, to);
        let final = [];

        for (let i = result.length - 1; i >= 0; i--) {
            (i % step === 0) && final.push(result[i]);
        };

        final.reverse();
        result = final;

        return result;
    }
}
