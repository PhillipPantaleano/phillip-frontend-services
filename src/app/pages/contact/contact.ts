import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  ngOnInit() {
    emailjs.init(environment.emailjs.publicKey);
  }

  onContactMethodChange(event: any) {
    const selectedValue = event?.value ?? event?.target?.value;
    const phoneField = document.getElementById('phoneField');

    if (selectedValue === 'phone') {
      phoneField?.classList.remove('hidden');
    } else {
      phoneField?.classList.add('hidden');
    }
  }

  formatPhoneNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 10);

    if (digits.length <= 3) {
      input.value = digits;
      return;
    }

    if (digits.length <= 6) {
      input.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return;
    }

    input.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const submitBtn = form.querySelector('button') as HTMLButtonElement;
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    emailjs
      .sendForm(environment.emailjs.serviceId, environment.emailjs.templateId, form)
      .then((result) => {
        console.log('Success:', result.text);
        alert('✅ Message sent successfully!');
        form.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        alert('❌ Failed to send message. Check console for details.');
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  }
}
