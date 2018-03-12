import { Injectable } from '@angular/core';

// Pipes
import { CmmdcPipe } from '../pipes/cmmdc.pipe';
import { ModuloPipe } from '../pipes/modulo.pipe';
import { RangePipe } from '../pipes/range.pipe';

@Injectable()
export class DecryptService {

    constructor(
        private cmmdc: CmmdcPipe,
        private modulo: ModuloPipe,
        private range: RangePipe) {}

    init(encrypted, p) {
        let zIndexes = [];
        let n = encrypted.length;
        let k = n - 2;
        let arrayOfSubsets = [];


        for (let i of this.range.transform(1, n)) {
            zIndexes.push(i);
        }

        let combinations = (list, k, arrayOfSubsets) => {
            if (list.length == k) {
                let a: string = JSON.stringify(arrayOfSubsets);
                let b: string = JSON.stringify(list)
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

        let subsetsA = combinations(zIndexes, k, arrayOfSubsets);
        console.log('All subsets: ', subsetsA);


        let modularInverse = (a, m) => {
            let [g, x, y] = this.cmmdc.transform(a, m);
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
                    productNumitor = this.modulo.transform((productNumitor * (i - j)), p);
                    for (let x of productPolinoms(current_poly, rank_1_poly)) {
                        current_poly.push(this.modulo.transform(x, p));
                    }
                }
            }
            if (productNumitor < 0) {
                productNumitor += p;
            }

            for (let curr = 0; curr < current_poly.length; curr++) {
                current_poly[curr] = this.modulo.transform(zIndex * current_poly[curr] * modularInverse(productNumitor, p), p);
            }

            for (let x of sumPolinoms(big_poly, current_poly)) {
                big_poly.push(this.modulo.transform(x, p));
            }
        }

        // console.log(`Coeficientii polinomului final, adica mesajul decodat: ${big_poly}`);
        return big_poly;
    }
}
