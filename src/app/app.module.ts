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
import { ActnTema1ReedSolomonComponent } from './actn/tema1ReedSolomon.component';

// Services
import { EncryptService } from './shared/services/encrypt.service';
import { DecryptService } from './shared/services/decrypt.service';

// Pipes
import { CmmdcPipe } from './shared/pipes/cmmdc.pipe';
import { ModuloPipe } from './shared/pipes/modulo.pipe';
import { RangePipe } from './shared/pipes/range.pipe';
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
        ActnTema1ReedSolomonComponent
    ],
    providers: [
        EncryptService,
        DecryptService,
        CmmdcPipe,
        ModuloPipe,
        RangePipe,
        ToBasePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
