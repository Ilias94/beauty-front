import { Component, ViewEncapsulation, effect, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Store } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { SaveCourseAction } from '../../state/course.actions';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { GetAiPromptAction } from '../../state/ai.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@jsverse/transloco';

function toLocalIsoString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
         `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function toLocalIsoDateOnly(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;
}

const CATEGORY_OPTIONS = [
  { value: 'Barber',                label: 'Barber' },
  { value: 'Hairdresser',           label: 'Hairdresser' },
  { value: 'Makeup Artist',         label: 'Makeup Artist' },
  { value: 'Nail Technician',       label: 'Nail Technician' },
  { value: 'Esthetician',           label: 'Esthetician' },
  { value: 'Massage Therapist',     label: 'Massage Therapist' },
  { value: 'Skin Care Specialist',  label: 'Skin Care Specialist' },
  { value: 'Lash Technician',       label: 'Lash Technician' },
  { value: 'Permanent Makeup Artist', label: 'Permanent Makeup Artist' },
  { value: 'Hair Colorist',         label: 'Hair Colorist' },
  { value: 'Wax Specialist',        label: 'Wax Specialist' },
];

function sectionHeader(icon: string, title: string, desc: string): FormlyFieldConfig {
  return {
    template: `<div class="cf-section-header">
      <span class="material-icons cf-section-icon">${icon}</span>
      <div>
        <h3 class="cf-section-title">${title}</h3>
        <p class="cf-section-desc">${desc}</p>
      </div>
    </div>`
  };
}

@Component({
  selector: 'app-course-form',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatNativeDateModule, FormlyMatDatepickerModule, ReactiveFormsModule,
    FormlyModule, MatButtonModule, MatIconModule, RouterModule,
    FormlyMaterialModule, NgxMaterialTimepickerModule, TranslocoModule
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.sass'
})
export class CourseFormComponent {
  searchInput$ = new Subject<string>();
  prompt: Signal<string> = toSignal(this.store.select((s: any) => s.ai.prompt));

  form = new FormGroup({});

  fields: FormlyFieldConfig[] = [

    // ── Course Type ─────────────────────────────────────────────────────
    sectionHeader('tune', 'Course Format', 'How will this course be delivered'),
    {
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          key: 'courseType',
          type: 'radio',
          defaultValue: 'IN_PERSON',
          props: {
            label: 'Delivery Format',
            required: true,
            options: [
              { value: 'IN_PERSON', label: '🏢 In-Person — students attend at a physical location' },
              { value: 'ONLINE',    label: '💻 Online — fully remote, video-based course' },
              { value: 'HYBRID',    label: '🔀 Hybrid — mix of in-person and online content' },
            ],
          }
        }
      ]
    },

    // ── Course Information ──────────────────────────────────────────────
    sectionHeader('menu_book', 'Course Information', 'Title, description and pricing'),
    {
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          key: 'title',
          type: 'input',
          props: {
            label: 'Course Title',
            placeholder: 'e.g. Advanced Makeup Artistry',
            required: true,
            minLength: 5,
            appearance: 'outline',
            keyup: (_: any, event: any) => this.searchInput$.next(event.target.value),
          }
        },
        {
          template: `<div class="cf-ai-hint">
            <span class="material-icons">auto_awesome</span>
            AI is generating a description suggestion based on your title
          </div>`
        },
        {
          key: 'description',
          type: 'textarea',
          props: {
            label: 'Description',
            placeholder: 'Describe what students will learn in this course...',
            rows: 5,
            required: true,
            appearance: 'outline',
          }
        },
        {
          fieldGroupClassName: 'cf-grid-2',
          fieldGroup: [
            {
              key: 'price',
              type: 'input',
              props: {
                label: 'Price (PLN)',
                placeholder: '150',
                type: 'number',
                min: 10,
                required: true,
                appearance: 'outline',
              }
            },
            {
              key: 'maxParticipants',
              type: 'input',
              props: {
                label: 'Max Participants',
                placeholder: '10',
                type: 'number',
                required: true,
                appearance: 'outline',
              }
            }
          ]
        }
      ]
    },

    // ── Schedule ────────────────────────────────────────────────────────
    sectionHeader('schedule', 'Schedule', 'When does the course take place'),
    {
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          fieldGroupClassName: 'cf-grid-2',
          fieldGroup: [
            {
              key: 'startDate',
              type: 'datepicker',
              props: {
                label: 'Start Date',
                placeholder: 'Select start date',
                required: true,
                appearance: 'outline',
              }
            },
            {
              key: 'endDate',
              type: 'datepicker',
              props: {
                label: 'End Date',
                placeholder: 'Select end date',
                required: true,
                appearance: 'outline',
              }
            }
          ]
        },
        {
          key: 'timePicker',
          type: 'time-picker',
          className: 'cf-half',
          props: {
            label: 'Start Time',
            placeholder: 'Select time',
            required: true,
          }
        }
      ]
    },

    // ── Location (hidden for ONLINE) ─────────────────────────────────────
    {
      hideExpression: 'model.courseType === "ONLINE"',
      template: `<div class="cf-section-header"><span class="material-icons cf-section-icon">location_on</span><div><h3 class="cf-section-title">Location</h3><p class="cf-section-desc">Where will the course be held</p></div></div>`
    },
    {
      hideExpression: 'model.courseType === "ONLINE"',
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          fieldGroupClassName: 'cf-grid-2',
          fieldGroup: [
            {
              key: 'city',
              type: 'input',
              props: { label: 'City', placeholder: 'e.g. Warsaw', required: true, appearance: 'outline' }
            },
            {
              key: 'postalCode',
              type: 'input',
              props: { label: 'Postal Code', placeholder: '00-000', required: true, appearance: 'outline' }
            }
          ]
        },
        {
          fieldGroupClassName: 'cf-grid-2',
          fieldGroup: [
            {
              key: 'street',
              type: 'input',
              props: { label: 'Street', placeholder: 'Street name', required: true, appearance: 'outline' }
            },
            {
              key: 'streetNumber',
              type: 'input',
              props: { label: 'Street No.', placeholder: '1A', required: true, appearance: 'outline' }
            }
          ]
        },
        {
          fieldGroupClassName: 'cf-grid-2',
          fieldGroup: [
            {
              key: 'district',
              type: 'input',
              props: { label: 'District', placeholder: 'District', required: true, appearance: 'outline' }
            },
            {
              key: 'apartmentNumber',
              type: 'input',
              props: { label: 'Apartment No.', placeholder: 'Optional', required: false, appearance: 'outline' }
            }
          ]
        }
      ]
    },

    // ── Category ────────────────────────────────────────────────────────
    sectionHeader('category', 'Category', 'What type of beauty course is this'),
    {
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          key: 'category',
          type: 'select',
          props: {
            label: 'Course Category',
            placeholder: 'Select a category',
            required: true,
            appearance: 'outline',
            options: CATEGORY_OPTIONS,
          }
        }
      ]
    }
  ];

  constructor(private store: Store) {
    effect(() => {
      if (this.prompt()) {
        this.form.patchValue({ description: this.prompt() });
      }
    });
  }

  ngOnInit() {
    this.searchInput$.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.store.dispatch(new GetAiPromptAction({ prompt: value }));
    });
  }

  submit() {
    const date: Date = this.form.get('startDate')?.value;
    const time: string = this.form.get('timePicker')?.value;
    const courseType = this.form.get('courseType')?.value || 'IN_PERSON';
    const isOnline = courseType === 'ONLINE';

    let startDateTimeIso: string | null = null;
    if (date && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const combined = new Date(date);
      combined.setHours(hours, minutes, 0, 0);
      startDateTimeIso = toLocalIsoString(combined);
    }

    const endDate = this.form.get('endDate')?.value as Date;

    this.store.dispatch(new SaveCourseAction({
      title: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      price: this.form.get('price')?.value,
      maxParticipants: this.form.get('maxParticipants')?.value,
      courseType,
      startDate: startDateTimeIso,
      endDate: endDate ? toLocalIsoDateOnly(endDate) : null,
      address: isOnline ? null : {
        district: this.form.get('district')?.value,
        street: this.form.get('street')?.value,
        streetNumber: this.form.get('streetNumber')?.value,
        apartmentNumber: this.form.get('apartmentNumber')?.value,
        city: this.form.get('city')?.value,
        postalCode: this.form.get('postalCode')?.value,
      },
      category: { label: this.form.get('category')?.value }
    }));
  }
}
