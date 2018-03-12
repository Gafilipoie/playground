import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';

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
        FormsModule
    ],
    declarations: [
        AppComponent
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
