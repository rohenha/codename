import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { By } from '@angular/platform-browser';
import { ZardButtonComponent } from '@/shared/components/button';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Codename');
  });

  it('should render a Zard button linking to API health', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const button = fixture.debugElement.query(By.directive(ZardButtonComponent));
    expect(button).toBeTruthy();
    expect(button.nativeElement.getAttribute('href')).toBe('/api/health');
    expect(button.nativeElement.textContent).toContain('Check API health');
  });
});
