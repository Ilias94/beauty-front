import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [NgxMaterialTimepickerModule, MatInputModule, FormlyModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.sass'
})
export class TimePickerComponent extends FieldType<FieldTypeConfig> {

}
