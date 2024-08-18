import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamelCasePipe } from './camelcase.pipe';
import { UnixTimestampPipe } from './unixTimestamp.pipe';

@NgModule({
  declarations: [CamelCasePipe, UnixTimestampPipe],
  imports: [
    CommonModule
  ],
  exports: [CamelCasePipe, UnixTimestampPipe]
})
export class PipesModule { }