#!/usr/bin/env node

/**
 * Script para generar enlaces de invitación para wedding RSVP
 * 
 * Uso:
 *   node scripts/generate-links.js <domain> <sheet-id>
 * 
 * Ejemplo:
 *   node scripts/generate-links.js https://miconco.vercel.app 1abc2def3ghi
 */

const fs = require('fs');
const path = require('path');

const domain = process.argv[2] || 'http://localhost:3000';

const guestIds = [
  'guest-001',
  'guest-002',
  'guest-003',
  'guest-004',
  'guest-005',
];

console.log('\n=== Wedding RSVP Invitation Links ===\n');
console.log(`Domain: ${domain}\n`);

const links = guestIds.map(id => {
  const url = `${domain}/rsvp?guest=${id}`;
  console.log(`${id}: ${url}`);
  return { id, url };
});

console.log('\n');

// Generate as CSV for Google Sheets
const csvContent = links.map(link => `${link.id},${link.url}`).join('\n');
console.log('CSV format (paste into Google Sheets):');
console.log(csvContent);

console.log('\n');
console.log('=== Instructions for Google Sheets ===\n');
console.log('1. Copy the URLs above');
console.log('2. Paste into column D (Invitation Link) in your Google Sheet');
console.log('3. Share the links with your guests via email');
console.log('\n');

// Save to file
const outputFile = path.join(__dirname, '../invitation-links.txt');
fs.writeFileSync(outputFile, links.map(l => `${l.id}: ${l.url}`).join('\n'));
console.log(`✅ Links saved to: ${outputFile}\n`);
