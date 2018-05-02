import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'range'})
export class RangePipe implements PipeTransform {
    transform(s, e, st?) {
        let list = [];

        if (typeof s == 'number') {
            let start: number = s;
            let end: number = e - 1;
            let step: number = st;

            list[0] = start;
            step = step || 1;
            while (start + step <= end) {
                list[list.length] = start += step;
            }
        } else {
            let start: string = s;
            let end: string = e;
            let str: string = 'abcdefghijklmnopqrstuvwxyz';

            if (start === start.toUpperCase()) {
                end = end.toUpperCase();
                str = str.toUpperCase();
            }
            str = str.substring(str.indexOf(start), str.indexOf(end) + 1);
            list = str.split('');
        }

        return list;
    }
}
