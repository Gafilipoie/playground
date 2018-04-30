import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { Http, HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routing';

// Components
import { ErrorComponent } from './error/error.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ReedSolomonComponent } from './actn/tema1/reedSolomon.component';
import { RsaComponent } from './actn/tema2/rsa.component';
import { Tema3Component } from './actn/tema3/tema3.component';

// Services
import { EncryptService } from './shared/services/encrypt.service';
import { DecryptService } from './shared/services/decrypt.service';

// Pipes
import { CmmdcPipe } from './shared/pipes/cmmdc.pipe';
import { ModuloPipe } from './shared/pipes/modulo.pipe';
import { RangePipe } from './shared/pipes/range.pipe';
import { RandomRangePipe } from './shared/pipes/random_range.pipe';
import { ToBasePipe } from './shared/pipes/toBase.pipe';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        HttpModule,
        FormsModule
    ],
    declarations: [
        ErrorComponent,
        AppComponent,
        HeaderComponent,
        HomeComponent,
        ReedSolomonComponent,
        RsaComponent,
		Tema3Component
    ],
    providers: [
        EncryptService,
        DecryptService,
        CmmdcPipe,
        ModuloPipe,
        RangePipe,
        RandomRangePipe,
        ToBasePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
