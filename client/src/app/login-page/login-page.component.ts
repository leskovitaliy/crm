import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  sub$: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private aRoute: ActivatedRoute) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });

    this.aRoute.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Now you can login in app use your credential');
      } else if (params['accessDenied']) {
        MaterialService.toast('Please login in app');
      } else if (params['sessionFailed']) {
        MaterialService.toast('Please login again');
      }
    });
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();

    this.sub$ = this.authService.login(this.form.value)
      .subscribe(
        () => this.router.navigate(['/overview']),
        (err) => {
          MaterialService.toast(err.error.message);
          this.form.enable();
        }
      );
  }

}
