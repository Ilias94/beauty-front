import { Routes } from '@angular/router';
import { LoginComponent } from './components/public/login/login.component';
import { RegisterComponent } from './components/public/register/register.component';
import { CourseFormComponent } from './components/private/course-form/course-form.component';
import { authGuard, guestGuard } from './auth.guard';
import { ForbiddenComponent } from './components/public/forbidden/forbidden.component';
import { NotFoundComponent } from './components/public/not-found/not-found.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { CreatorCoursesComponent } from './components/creator-courses/creator-courses.component';
import { StudentCoursesComponent } from './components/student-courses/student-courses.component';
import { MyCommentsComponent } from './components/my-comments/my-comments.component';
import { PaymentStatusComponent } from './components/payment-status/payment-status.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { QuestionResultsComponent } from './components/question-results/question-results.component';
import { EditQuestionsComponent } from './components/edit-questions/edit-questions.component';
import { ResolveQuestionsComponent } from './components/resolve-questions/resolve-questions.component';
import { MyTicketsComponent } from './components/tickets/my-tickets/my-tickets.component';
import { TicketCreateComponent } from './components/tickets/ticket-create/ticket-create.component';
import { TicketDetailComponent } from './components/tickets/ticket-detail/ticket-detail.component';
import { SupportTicketsComponent } from './components/tickets/support-tickets/support-tickets.component';
import { GroupChatsPageComponent } from './components/group-chats-page/group-chats-page.component';


export const routes: Routes = [
    { path: '', redirectTo: 'courses', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'registry', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'forbidden', component: ForbiddenComponent },
    { path: 'courses', component: CoursesComponent },
    { path: 'course/:id', component: CourseDetailsComponent },
    {
        path: 'course',
        component: CourseFormComponent,
        canActivate: [authGuard],
        data: { roles: ['TEACHER'] }
    },
    {
        path: 'my-account',
        component: MyAccountComponent,
        canActivate: [authGuard]
    },
    {
        path: 'account',
        component: AccountFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'creator-courses',
        component: CreatorCoursesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'student-courses',
        component: StudentCoursesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'my-comments',
        component: MyCommentsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'payment-status',
        component: PaymentStatusComponent,
        canActivate: [authGuard]
    },
    {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [authGuard]
    },
    {
        path: 'questions/:courseId',
        component: QuestionResultsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'edit-questions/:courseId',
        component: EditQuestionsComponent,
        canActivate: [authGuard],
        data: { roles: ['TEACHER'] }
    },
    {
        path: 'resolve-questions/:courseId',
        component: ResolveQuestionsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'my-tickets',
        component: MyTicketsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'my-tickets/new',
        component: TicketCreateComponent,
        canActivate: [authGuard]
    },
    {
        path: 'my-tickets/:id',
        component: TicketDetailComponent,
        canActivate: [authGuard]
    },
    {
        path: 'support/tickets',
        component: SupportTicketsComponent,
        canActivate: [authGuard],
        data: { roles: ['SUPPORT'] }
    },
    {
        path: 'group-chats',
        component: GroupChatsPageComponent,
        canActivate: [authGuard]
    },
    { path: '**', component: NotFoundComponent },
];
