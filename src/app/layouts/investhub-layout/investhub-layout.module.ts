import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvestHubLayoutRoutes } from './investhub-layout.routing';
import { ComponentsModule } from 'app/components/components.module';
import { MaterialModule } from 'app/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InvestHubLayoutRoutes),
    MaterialModule,
    ComponentsModule,
  ],
  declarations: []
})

export class InvestHubLayoutModule {}
