import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  formSubmitted = false;
  isSubmitting = false;
  errorMessage: string | null = null;

  onContactMethodChange(event: any) {
    const phoneField = document.getElementById('phoneField');
    if (event.value === 'phone') {
      phoneField?.classList.remove('hidden');
    } else {
      phoneField?.classList.add('hidden');
    }
  }

  formatPhoneNumber(event: any) {
    let input = event.target.value.replace(/\D/g, '');

    if (input.length > 0) {
      if (input.length <= 3) {
        input = `(${input}`;
      } else if (input.length <= 6) {
        input = `(${input.slice(0, 3)}) ${input.slice(3)}`;
      } else {
        input = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
      }
    }

    event.target.value = input;
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitting = true;
    this.errorMessage = null;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/mpqvoblj', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.formSubmitted = true;
        form.reset();
        document.getElementById('phoneField')?.classList.add('hidden');
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('Formspree Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorData
        });

        if (response.status === 403) {
          this.errorMessage = 'Unable to send message right now. Please try again in a moment or email me directly.';
        } else if (response.status === 429) {
          this.errorMessage = 'Too many attempts. Please wait a minute and try again.';
        } else if (response.status >= 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      this.errorMessage = 'Network error. Please check your connection and try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.formSubmitted = false;
    this.errorMessage = null;
  }
}
