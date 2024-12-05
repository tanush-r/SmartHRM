import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth.guard'; // Import the AuthGuard
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../pages/layout/layout.component';
import { HomeComponent } from '../pages/home/home.component';
import { ResumelistComponent } from '../pages/resumelist/resumelist.component';
import { QuestionerComponent } from '../pages/questioner/questioner.component';
import { ResumeUploadComponent } from '../pages/resume-upload/resume-upload.component';
import { JDUploadComponent } from '../pages/jd-upload/jd-upload.component';
import { ClientsMasterComponent } from '../pages/clients-master/clients-master.component';
import { ClientFormComponent } from '../pages/client-form/client-form.component';
import { CandidateMasterComponent } from '../pages/candidate-master/candidate-master.component';
import { CandidateFormComponent } from '../pages/candidate-form/candidate-form.component';
import { RequirementsMasterComponent } from '../pages/requirements-master/requirements-master.component';
import { RequirementsFormComponent } from '../pages/requirements-form/requirements-form.component';
import { ChatbotService } from '../pages/chatbot/chatbot/Chat service';
import { LoginComponent } from '../pages/login/login.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard], // Protect the login route
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // Protect child routes
    children: [
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },
      {
        path: 'chatbot',
        component: ChatbotService,
        title: 'Chatbot',
      },
      {
        path: 'resumelist',
        component: ResumelistComponent,
        title: 'Resume List',
      },
      {
        path: 'questioner',
        component: QuestionerComponent,
        title: 'Questioner',
      },
      {
        path: 'resume-upload',
        component: ResumeUploadComponent,
        title: 'Resume Upload',
      },
      {
        path: 'jd-upload',
        component: JDUploadComponent,
        title: 'JD Upload',
      },
      {
        path: 'clients-master',
        component: ClientsMasterComponent,
        title: 'Clients Master',
      },
      {
        path: 'client-form',
        component: ClientFormComponent,
        title: 'Client Form',
      },
      {
        path: 'candidate-master',
        component: CandidateMasterComponent,
        title: 'Candidate Master',
      },
      {
        path: 'candidate-form',
        component: CandidateFormComponent,
        title: 'Candidate Form',
      },
      {
        path: 'requirement-master',
        component: RequirementsMasterComponent,
        title: 'Requirement Master',
      },
      {
        path: 'requirements-form',
        component: RequirementsFormComponent,
        title: 'Requirements Form',
      },
      { path: '**', redirectTo: 'home' } // Catch-all route
    ],
  },
  { path: '**', redirectTo: '/login' } // Catch-all for any other paths
];
