import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { LINKS_PAGES } from '../../constants/layouts';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('floating') floatingRef: ElementRef;

  readonly links = LINKS_PAGES;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    MaterialService.initFloatingBtn(this.floatingRef);
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
