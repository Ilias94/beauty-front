import { Component, DestroyRef, ViewEncapsulation, effect, Signal, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Store } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { SaveCourseAction } from '../../state/course.actions';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { GetAiPromptAction } from '../../state/ai.actions';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { categoryKey } from '../../../shared/category-visual';

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
      <span class="material-symbols-rounded cf-section-icon">${icon}</span>
      <div>
        <h3 class="cf-section-title">${title}</h3>
        <p class="cf-section-desc">${desc}</p>
      </div>
    </div>`
  };
}

@Component({
    selector: 'app-course-form',
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
  private router = inject(Router);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({});

  model: Record<string, unknown> = {};
  fields: FormlyFieldConfig[] = [];

  /** Built per language; the shared model keeps typed values when the language changes. */
  private buildFields(): FormlyFieldConfig[] {
    const t = (key: string) => this.transloco.translate('courseForm.' + key);
    return [

    // ── Course Type ─────────────────────────────────────────────────────
    sectionHeader('tune', t('courseFormatSection'), t('courseFormatDesc')),
    {
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          template: '<p class="cf-radio-label">' + t('deliveryFormat') + ' <span class="cf-required">*</span></p>'
        },
        {
          key: 'courseType',
          type: 'radio',
          defaultValue: 'IN_PERSON',
          wrappers: [],
          props: {
            required: true,
            options: [
              { value: 'IN_PERSON', label: t('inPerson') },
              { value: 'ONLINE',    label: t('onlineOption') },
              { value: 'HYBRID',    label: t('hybridOption') },
            ],
          }
        }
      ]
    },

    // ── Course Information ──────────────────────────────────────────────
    sectionHeader('menu_book', t('courseInfoSection'), t('courseInfoDesc')),
    {
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          key: 'title',
          type: 'input',
          props: {
            label: t('courseTitleLabel'),
            placeholder: t('courseTitlePlaceholder'),
            required: true,
            minLength: 5,
            appearance: 'outline',
            keyup: (_: any, event: any) => this.searchInput$.next(event.target.value),
          }
        },
        {
          template: `<div class="cf-ai-hint">
            <span class="material-symbols-rounded">auto_awesome</span>
            ${t('aiHint')}
          </div>`
        },
        {
          key: 'description',
          type: 'textarea',
          props: {
            label: t('descriptionLabel'),
            placeholder: t('descriptionPlaceholder'),
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
                label: t('pricePln'),
                placeholder: '150',
                type: 'number',
                min: 0,
                required: true,
                appearance: 'outline',
              }
            },
            {
              key: 'maxParticipants',
              type: 'input',
              props: {
                label: t('maxParticipants'),
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

    // ── Level, Language & Certificate ───────────────────────────────────
    sectionHeader('school', t('detailsSection'), t('detailsDesc')),
    {
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          fieldGroupClassName: 'cf-grid-2',
          fieldGroup: [
            {
              key: 'courseLevel',
              type: 'select',
              defaultValue: 'BEGINNER',
              props: {
                label: t('difficultyLevel'),
                required: true,
                appearance: 'outline',
                options: [
                  { value: 'BEGINNER',     label: t('beginner') },
                  { value: 'INTERMEDIATE', label: t('intermediate') },
                  { value: 'ADVANCED',     label: t('advanced') },
                ]
              }
            },
            {
              key: 'language',
              type: 'select',
              defaultValue: 'pl',
              props: {
                label: t('courseLanguage'),
                required: true,
                appearance: 'outline',
                options: [
                  { value: 'pl', label: t('languagePl') },
                  { value: 'en', label: t('languageEn') },
                ]
              }
            }
          ]
        },
        {
          template: '<p class="cf-radio-label" style="margin-top:8px">' + t('certificate') + '</p>'
        },
        {
          key: 'certificate',
          type: 'radio',
          defaultValue: false,
          wrappers: [],
          props: {
            options: [
              { value: true,  label: t('certificateYes') },
              { value: false, label: t('certificateNo') },
            ]
          }
        }
      ]
    },

    // ── What you'll learn ───────────────────────────────────────────────
    sectionHeader('lightbulb', t('learningSection'), t('learningDesc')),
    {
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          key: 'learningOutcomes',
          type: 'textarea',
          props: {
            label: t('learningOutcomes'),
            placeholder: t('learningOutcomesPlaceholder'),
            rows: 4,
            appearance: 'outline',
          }
        },
        {
          key: 'prerequisites',
          type: 'textarea',
          props: {
            label: t('prerequisites'),
            placeholder: t('prerequisitesPlaceholder'),
            rows: 3,
            appearance: 'outline',
          }
        }
      ]
    },

    // ── Schedule ────────────────────────────────────────────────────────
    sectionHeader('schedule', t('scheduleSection'), t('scheduleDesc')),
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
                label: t('startDate'),
                placeholder: t('startDatePlaceholder'),
                required: true,
                appearance: 'outline',
              }
            },
            {
              key: 'endDate',
              type: 'datepicker',
              props: {
                label: t('endDate'),
                placeholder: t('endDatePlaceholder'),
                required: true,
                appearance: 'outline',
              }
            }
          ]
        },
        {
          fieldGroupClassName: 'cf-grid-2',
          fieldGroup: [
            {
              key: 'timePicker',
              type: 'time-picker',
              props: {
                label: t('startTime'),
                placeholder: t('startTimePlaceholder'),
                required: true,
              }
            },
            {
              key: 'endTimePicker',
              type: 'time-picker',
              props: {
                label: t('endTime'),
                placeholder: t('startTimePlaceholder'),
                required: false,
              }
            }
          ]
        }
      ]
    },

    // ── Location (hidden for ONLINE) ─────────────────────────────────────
    {
      hideExpression: 'model.courseType === "ONLINE"',
      template: `<div class="cf-section-header"><span class="material-symbols-rounded cf-section-icon">location_on</span><div><h3 class="cf-section-title">${t('locationSection')}</h3><p class="cf-section-desc">${t('locationDesc')}</p></div></div>`
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
              props: { label: t('city'), placeholder: t('cityPlaceholder'), required: true, appearance: 'outline' }
            },
            {
              key: 'postalCode',
              type: 'input',
              props: { label: t('postalCode'), placeholder: '00-000', required: true, appearance: 'outline' }
            }
          ]
        },
        {
          fieldGroupClassName: 'cf-grid-2',
          fieldGroup: [
            {
              key: 'street',
              type: 'input',
              props: { label: t('street'), placeholder: t('streetPlaceholder'), required: true, appearance: 'outline' }
            },
            {
              key: 'streetNumber',
              type: 'input',
              props: { label: t('streetNo'), placeholder: '1A', required: true, appearance: 'outline' }
            }
          ]
        },
        {
          fieldGroupClassName: 'cf-grid-2',
          fieldGroup: [
            {
              key: 'district',
              type: 'input',
              props: { label: t('district'), placeholder: t('districtPlaceholder'), required: false, appearance: 'outline' }
            },
            {
              key: 'apartmentNumber',
              type: 'input',
              props: { label: t('apartmentNo'), placeholder: t('apartmentPlaceholder'), required: false, appearance: 'outline' }
            }
          ]
        }
      ]
    },

    // ── Category ────────────────────────────────────────────────────────
    sectionHeader('category', t('categorySection'), t('categoryDesc')),
    {
      fieldGroupClassName: 'cf-card',
      fieldGroup: [
        {
          key: 'category',
          type: 'select',
          props: {
            label: t('courseCategory'),
            placeholder: t('categoryPlaceholder'),
            required: true,
            appearance: 'outline',
            options: CATEGORY_OPTIONS.map(o => ({ value: o.value, label: this.transloco.translate(categoryKey(o.value)) })),
          }
        }
      ]
    }
    ];
  }

  constructor(private store: Store) {
    // The sticky action bar sits at the bottom on phones; lift the floating chat buttons above it.
    const body = inject(DOCUMENT).body;
    body.classList.add('has-bottom-bar');
    this.destroyRef.onDestroy(() => body.classList.remove('has-bottom-bar'));

    this.transloco.selectTranslation().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fields = this.buildFields());
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

  private buildCoursePayload(status: 'DRAFT' | 'PUBLISHED'): any {
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
    const endTime: string = this.form.get('endTimePicker')?.value;
    let endDateTimeIso: string | null = null;
    if (endDate && endTime) {
      const [h, m] = endTime.split(':').map(Number);
      const combined = new Date(endDate);
      combined.setHours(h, m, 0, 0);
      endDateTimeIso = toLocalIsoString(combined);
    } else if (endDate) {
      endDateTimeIso = toLocalIsoDateOnly(endDate);
    }

    return {
      title:            this.form.get('title')?.value,
      description:      this.form.get('description')?.value,
      price:            this.form.get('price')?.value,
      maxParticipants:  this.form.get('maxParticipants')?.value,
      courseType,
      courseLevel:      this.form.get('courseLevel')?.value || 'BEGINNER',
      language:         this.form.get('language')?.value || 'pl',
      certificate:      this.form.get('certificate')?.value ?? false,
      learningOutcomes: this.form.get('learningOutcomes')?.value || null,
      prerequisites:    this.form.get('prerequisites')?.value || null,
      status,
      startDate: startDateTimeIso,
      endDate:   endDateTimeIso,
      address: isOnline ? null : {
        district:        this.form.get('district')?.value || null,
        street:          this.form.get('street')?.value,
        streetNumber:    this.form.get('streetNumber')?.value,
        apartmentNumber: this.form.get('apartmentNumber')?.value || null,
        city:            this.form.get('city')?.value,
        postalCode:      this.form.get('postalCode')?.value,
      },
      category: { label: this.form.get('category')?.value }
    };
  }

  submit() {
    this.store.dispatch(new SaveCourseAction(this.buildCoursePayload('PUBLISHED')))
      .subscribe(() => this.router.navigate(['/creator-courses']));
  }

  saveDraft() {
    this.store.dispatch(new SaveCourseAction(this.buildCoursePayload('DRAFT')))
      .subscribe(() => this.router.navigate(['/creator-courses']));
  }
}
