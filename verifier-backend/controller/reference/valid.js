import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const allowedDomains = JSON.parse(
  fs.readFileSync(path.join(dirname, './filtered_inst.json'))
);

export function isValidDomain(email) {
  if (!email || !email.includes('@')) return false;

  const domain = email.split('@')[1];
  return allowedDomains.some(
    (allowedDomain) =>
      domain === allowedDomain || domain.endsWith('.' + allowedDomain)
  );
}
