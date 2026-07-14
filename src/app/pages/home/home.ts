import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
})
export class Home implements OnInit, OnDestroy {
  readonly typedText = signal('');

  private readonly words = ['Frontend Developer', 'Freelancer'];
  private wordIndex = 0;
  private isDeleting = false;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.tick();
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private tick(): void {
    const word = this.words[this.wordIndex];
    const current = this.typedText();

    if (this.isDeleting) {
      this.typedText.set(word.slice(0, Math.max(0, current.length - 1)));
    } else {
      this.typedText.set(word.slice(0, current.length + 1));
    }

    let delay = this.isDeleting ? 40 : 70;

    if (!this.isDeleting && this.typedText() === word) {
      delay = 1600;
      this.isDeleting = true;
    } else if (this.isDeleting && this.typedText() === '') {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      delay = 500;
    }

    this.cdr.markForCheck();
    this.timeoutId = setTimeout(() => this.tick(), delay);
  }
}
