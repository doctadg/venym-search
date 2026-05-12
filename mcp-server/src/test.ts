import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { extractContacts } from './venym-search-api.js';

test('extractContacts should find emails', () => {
  const text = 'Contact us at hello@example.com for more information';
  const contacts = extractContacts(text);
  
  assert.equal(contacts.length, 1);
  assert.equal(contacts[0].type, 'email');
  assert.equal(contacts[0].value, 'hello@example.com');
});

test('extractContacts should find phone numbers', () => {
  const text = 'Call us at (555) 123-4567 or +1-555-987-6543';
  const contacts = extractContacts(text);
  
  assert.equal(contacts.length, 2);
  assert.equal(contacts[0].type, 'phone');
  assert.equal(contacts[1].type, 'phone');
});

test('extractContacts should find both emails and phones', () => {
  const text = `
    Get in touch with our team:
    Email: support@company.com
    Phone: (555) 123-4567
    Alternative: backup@company.org
  `;
  const contacts = extractContacts(text);
  
  const emails = contacts.filter(c => c.type === 'email');
  const phones = contacts.filter(c => c.type === 'phone');
  
  assert.equal(emails.length, 2);
  assert.equal(phones.length, 1);
});

test('extractContacts should return empty array for no contacts', () => {
  const text = 'This is just some regular text with no contact information';
  const contacts = extractContacts(text);
  
  assert.equal(contacts.length, 0);
});