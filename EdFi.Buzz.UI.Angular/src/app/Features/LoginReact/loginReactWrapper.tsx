import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  NgZone
} from '@angular/core';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ActivatedRoute, Router } from '@angular/router';

import { Login } from './login';
import { ApiService } from 'src/app/Services/api.service';

import GlobalFonts from '../../../globalstyle';
import { ThemeProvider } from 'styled-components';
import BuzzTheme from '../../../buzztheme';
import { EnvironmentService } from 'src/app/Services/environment.service';

const containerElementName = 'loginReactComponentContainer';

@Component({
  selector: 'app-login-react',
  template: `<span #${containerElementName}></span>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class LoginReactWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;

  @Input() public counter = 100;
  @Output() public componentClick = new EventEmitter<void>();

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private environmentService: EnvironmentService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render() {
    ReactDOM.render(<>
      <GlobalFonts />
      <ThemeProvider theme={BuzzTheme}>
        <Login
          api={this.api}
          navigate={(command) => this.ngZone.run(() => this.router.navigate([command]))}
          returnUrl={this.route.snapshot.queryParams['returnUrl']}
          googleClientId={this.environmentService.environment.GOOGLE_CLIENT_ID}
          adfsClientId={this.environmentService.environment.ADFS_CLIENT_ID}
          adfsTenantId={this.environmentService.environment.ADFS_TENANT_ID}
          />
      </ThemeProvider>
    </>, this.containerRef.nativeElement);
  }
}
