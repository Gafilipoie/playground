import { HomeComponent } from './home/home.component';
import { ActnTema1ReedSolomonComponent } from './actn/tema1ReedSolomon.component';
import { ErrorComponent } from './error/error.component';

export const routes = [
    { path: '', component: HomeComponent },
    { path: 'actn-tema1-reed-solomon', component: ActnTema1ReedSolomonComponent },
    { path: '**', component: ErrorComponent }
];
