import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-start',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    void this.router.navigateByUrl(this.authService.rutaInicial(), { replaceUrl: true });
  }
}
