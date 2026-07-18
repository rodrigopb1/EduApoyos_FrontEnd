import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <main class="bootstrap-page">
      <section class="card">
        <p class="eyebrow">EduApoyos</p>
        <h1>Portal de apoyos educativos</h1>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
