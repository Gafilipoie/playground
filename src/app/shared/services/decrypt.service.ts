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

    init(encrypted: number[], p: number): number[] {
        let zIndexes: number[] = [];
        let n: number = encrypted.length;
        let k: number = n - 2;
        let arrayOfSubsets: number[][] = [];


        for (let i of this.range.transform(1, n)) {
            zIndexes.push(i);
        }

        let combinations = (list: number[], k: number, arrayOfSubsets: number[][]): number[][] => {
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
                let subList: number[] = list.slice();
                let index: number = subList.indexOf(elem);
                if (index > -1) {
                    subList.splice(index, 1);
                }
                combinations(subList, k, arrayOfSubsets);
            }

            return arrayOfSubsets;
        };

        let subsetsA: number[][] = combinations(zIndexes, k, arrayOfSubsets);
        console.log('All A[] subsets: ', subsetsA);


        let subsetA: number[] = [];

        let modularInverse = (a: number, m: number): number => {
            let [g, x, y]: number[] = this.cmmdc.transform(a, m);
            if (g != 1) {
                throw "Nu exista invers modular";
            }
            return this.modulo.transform(x, m); // x % m
        }

        let productSubset = (subset: number[], i: number, base: number): number => {
            let product: number = 1;
            let productNumitori: number = 1;

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

        let fcCheck = (subset: number[], encrypted: number[], p: number): number => {
            let sum: number = 0;
            for (let i of subset) {
                sum += encrypted[i-1] * productSubset(subset, i, p);
            }
            return sum % p;
        }

        for (let subset of subsetsA) {
            let fc: number = fcCheck(subset, encrypted, p);
            if (Object.is(fc, 0)) {
                subsetA = subset;
                break;
            }
        }
        console.log(`fc = 0 for subset: [${subsetA}]`);


        let pX: number[] = [0];
        let current_poly: number[] = [];

        let productPolinoms = (p1: number[], p2: number[]): number[] => {
            let coefficients: number[] = Array.apply(null, Array(p2.length + p1.length - 1)).map(Number.prototype.valueOf,0);
            p1.map((coef1: number, index1: number) => {
                p2.map((coef2: number, index2: number) => {
                    coefficients[index1 + index2] += (coef1 * coef2);
                });
            });
            current_poly = [];
            return coefficients;
        }

        let sumPolinoms = (p1: number[], p2: number[]): number[] => {
            pX = [];
            let arr: number[] = [];
            for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
                arr.push((p1[i] || 0) + (p2[i] || 0));
            }
            return arr;
        }

        for (let i of subsetA) {
            current_poly = [1];
            let zIndex: number = encrypted[i-1];
            let productNumitor: number = 1;
            for (let j of subsetA) {
                if (j != i) {
                    let rank_1_poly: number[] = [1, -j];
                    productNumitor = this.modulo.transform((productNumitor * (i - j)), p); // (productNumitor * (i - j)) % p
                    for (let x of productPolinoms(current_poly, rank_1_poly)) {
                        current_poly.push(this.modulo.transform(x, p)); // x % p
                    }
                }
            }
            if (productNumitor < 0) {
                productNumitor += p;
            }

            for (let curr = 0; curr < current_poly.length; curr++) {
                current_poly[curr] = this.modulo.transform(zIndex * current_poly[curr] * modularInverse(productNumitor, p), p); // (zIndex * current_poly[curr] * modularInverse(productNumitor, p)) % p
            }

            for (let x of sumPolinoms(pX, current_poly)) {
                pX.push(this.modulo.transform(x, p)); // x % p
            }
        }

        // console.log(`Coeficientii polinomului final, adica mesajul decodat: ${pX}`);
        return pX;
    }
}
