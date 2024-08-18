import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamelCasePipe } from '../camelcase.pipe';

@NgModule({
  declarations: [CamelCasePipe],
  imports: [
    CommonModule
  ],
  exports: [CamelCasePipe]
})
export class PipesModule { }