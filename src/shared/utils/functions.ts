import * as bcrypt from 'bcrypt';

export const generatePassword = (): string => {
  return Math.random().toString(36).slice(-8);
};

export async function encrypt(password: string): Promise<string> {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
}

export async function passwordMatch(hash: string, password: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function getNumbersFromString(str: string): string {
  const res = str.replace(/\D/g, '');
  return res;
}

export function formatString(str: string): string {
  if (!str) {
    return '';
  }

  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}