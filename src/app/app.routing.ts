import { HomeComponent } from './home/home.component';
import { ReedSolomonComponent } from './actn/tema1/reedSolomon.component';
import { RsaComponent } from './actn/tema2/rsa.component';
import { Tema3Component } from './actn/tema3/tema3.component';
import { ErrorComponent } from './error/error.component';

export const routes = [
    { path: '', component: HomeComponent },
    { path: 'actn-reed-solomon', component: ReedSolomonComponent },
    { path: 'actn-rsa', component: RsaComponent },
	{ path: 'actn-tema3', component: Tema3Component },
    { path: '**', component: ErrorComponent }
];
