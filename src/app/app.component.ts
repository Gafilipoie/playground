import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor() {}

    ngOnInit() {
        this.reedSolomon();
    }

    modulo(x, y) {
        return (x % y + y) % y;
    }

    encode(m, s, p) {
        let k = m.length + 1;
        let n = k + 2 * s;
        let result = [];

        let range = (s, e, st?) => {
            let start = s;
            let end = e;
            let step = st;
            let list = [];

            if (typeof start == 'number') {
                list[0] = start;
                step = step || 1;
                while (start + step <= end) {
                    list[list.length] = start += step;
                }
            } else {
                let s = 'abcdefghijklmnopqrstuvwxyz';
                if (start === start.toUpperCase()) {
                    end = end.toUpperCase();
                    s = s.toUpperCase();
                }
                s = s.substring(s.indexOf(start), s.indexOf(end) + 1);
                list = s.split('');
            }

            return list;
        };

        let polynom = (m, x, p) => {
            let result = m[0];
            for (let i of m.slice(1)) {
                result = result * x + i;
            }
            result *= x;
            return result % p;
        };

        for (let i of range(1, n)) {
            result.push(polynom(m, i, p));
        }

        return result;
    }

    decode(encrypted, p) {
        let zIndexes = [];
        let n = encrypted.length;
        let rank = n - 2;
        let arrayOfSubsets = [];

        let range = (s, e, st?) => {
            let start = s;
            let end = e;
            let step = st;
            let list = [];

            if (typeof start == 'number') {
                list[0] = start;
                step = step || 1;
                while (start + step <= end) {
                    list[list.length] = start += step;
                }
            } else {
                let s = 'abcdefghijklmnopqrstuvwxyz';
                if (start === start.toUpperCase()) {
                    end = end.toUpperCase();
                    s = s.toUpperCase();
                }
                s = s.substring(s.indexOf(start), s.indexOf(end) + 1);
                list = s.split('');
            }

            return list;
        };

        for (let i of range(1, n)) {
            zIndexes.push(i);
        }

        let combinations = (list, k, arrayOfSubsets) => {
            if (list.length == k) {
                let a = JSON.stringify(arrayOfSubsets);
                let b = JSON.stringify(list)
                if (a.indexOf(b) == -1) {
                    arrayOfSubsets.push(list);
                }
                return arrayOfSubsets;
            }
            if (list.length < k || k == 0) {
                return [[]];
            }
            for (let elem of list) {
                let subList = list.slice();
                let index = subList.indexOf(elem);
                if (index > -1) {
                    subList.splice(index, 1);
                }
                combinations(subList, k, arrayOfSubsets);
            }

            return arrayOfSubsets;
        };

        let subsetsA = combinations(zIndexes, rank, arrayOfSubsets);
        console.log('All subsets: ', subsetsA);

        let modularInverse = (a, m) => {
            let cmmdc = (a, b) => {
                if (a == 0) return [b, 0, 1];
                let [g, y, x] = cmmdc(b % a, a);
                return [g, x - (Math.floor(b / a)) * y, y]
            }

            let [g, x, y] = cmmdc(a, m);
            if (g != 1) {
                throw "Nu exista invers modular";
            }
            return x % m;
        }

        let productSubset = (subset, i, base) => {
            let product = 1;
            let productNumitori = 1;

            for (let j of subset) {
                if (j != i) {
                    product *= j;
                    productNumitori = (productNumitori * (j - i)) % base;
                }
            }
            if (productNumitori < 0) {
                productNumitori += base;
            }

            return product * modularInverse(productNumitori, base);
        }

        let fcCheck = (subset, encrypted, p) => {
            let sum = 0;
            for (let i of subset) {
                sum += encrypted[i-1] * productSubset(subset, i, p);
            }
            return sum % p;
        }

        let subsetA = [];

        for (let subset of subsetsA) {
            let fc = fcCheck(subset, encrypted, p);
            if (Object.is(fc, 0)) {
                subsetA = subset;
                break;
            }
        }
        console.log(`fc = 0 for subset: [${subsetA}]`);

        let big_poly = [0];
        let current_poly = [];

        let productPolinoms = (p1, p2) => {
            let coefficients = Array.apply(null, Array(p2.length + p1.length - 1)).map(Number.prototype.valueOf,0);
            p1.map((coef1, index1) => {
                p2.map((coef2, index2) => {
                    coefficients[index1 + index2] += (coef1 * coef2);
                });
            });
            current_poly = [];
            return coefficients;
        }

        let sumPolinoms = (p1, p2) => {
            big_poly = [];
            let arr = [];
            for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
                arr.push((p1[i] || 0) + (p2[i] || 0));
            }
            return arr;
        }

        for (let i of subsetA) {
            current_poly = [1];
            let zIndex = encrypted[i-1];
            let productNumitor = 1;
            for (let j of subsetA) {
                if (j != i) {
                    let rank_1_poly = [1, -j];
                    productNumitor = this.modulo((productNumitor * (i - j)), p);
                    for (let x of productPolinoms(current_poly, rank_1_poly)) {
                        current_poly.push(this.modulo(x, p));
                    }
                }
            }
            if (productNumitor < 0) {
                productNumitor += p;
            }

            for (let curr = 0; curr < current_poly.length; curr++) {
                current_poly[curr] = this.modulo(zIndex * current_poly[curr] * modularInverse(productNumitor, p), p);
            }

            for (let x of sumPolinoms(big_poly, current_poly)) {
                big_poly.push(this.modulo(x, p));
            }
        }

        // console.log(`Coeficientii polinomului final, adica mesajul decodat: ${big_poly}`);
        return big_poly;
    }

    reedSolomon() {
        let message: number = 29;
        let s: number = 1;
        let p: number = 11;

        let toBase = (m, p) => {
            let number = m;
            let base = p;
            let result = [];

            if (number % base == 0) {
                result.splice(result.length, 0, 0);
                number = 0;
            }

            while (number > 0) {
                if (number % base == 0) {
                    number = Math.floor(number / base);
                } else {
                    result.splice(result.length, 0, number % base);
                    number = Math.floor(number / base);
                }
            }

            return result.reverse();
        };

        let m = toBase(message, p);
        console.log(`m(29) in base p(11): [${m.toString()}]`);

        let encrypted = this.encode(m, s, p);
        console.log(`Encrypted Message: [${encrypted.toString()}]`);

        encrypted[1] = 2;
        console.log(`Message with error: [${encrypted.toString()}]`);

        let decrypted = this.decode(encrypted, p);
        console.log(`Decrypted Message: [${decrypted.toString()}]`);
    }
}
