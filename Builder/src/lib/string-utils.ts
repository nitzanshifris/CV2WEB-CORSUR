interface StringOptions {
  maxLength?: number;
  ellipsis?: string;
  preserveWords?: boolean;
}

export function truncate(str: string, options: StringOptions = {}): string {
  const { maxLength = 100, ellipsis = '...', preserveWords = true } = options;

  if (str.length <= maxLength) {
    return str;
  }

  if (preserveWords) {
    const words = str.split(' ');
    let result = '';
    let currentLength = 0;

    for (const word of words) {
      if (currentLength + word.length + ellipsis.length > maxLength) {
        break;
      }
      result += (result ? ' ' : '') + word;
      currentLength = result.length;
    }

    return result + ellipsis;
  }

  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titleCase(str: string): string {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

export function camelCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

export function kebabCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(word => word.toLowerCase())
    .join('-');
}

export function snakeCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(word => word.toLowerCase())
    .join('_');
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

export function countWords(str: string): number {
  return str.split(/\s+/).filter(Boolean).length;
}

export function countCharacters(str: string): number {
  return str.length;
}

export function countBytes(str: string): number {
  return new TextEncoder().encode(str).length;
}

export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

export function isPalindrome(str: string): boolean {
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalized === reverse(normalized);
}

export function contains(str: string, search: string): boolean {
  return str.toLowerCase().includes(search.toLowerCase());
}

export function startsWith(str: string, search: string): boolean {
  return str.toLowerCase().startsWith(search.toLowerCase());
}

export function endsWith(str: string, search: string): boolean {
  return str.toLowerCase().endsWith(search.toLowerCase());
}

export function replaceAll(str: string, search: string | RegExp, replace: string): string {
  return str.replace(new RegExp(search, 'g'), replace);
}

export function extractEmails(str: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return str.match(emailRegex) || [];
}

export function extractUrls(str: string): string[] {
  const urlRegex = /(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/g;
  return str.match(urlRegex) || [];
}

export function extractHashtags(str: string): string[] {
  const hashtagRegex = /#[\w-]+/g;
  return str.match(hashtagRegex) || [];
}

export function extractMentions(str: string): string[] {
  const mentionRegex = /@[\w-]+/g;
  return str.match(mentionRegex) || [];
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const maskedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.slice(-1);
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  return phone.replace(/\d(?=\d{4})/g, '*');
}

export function maskCreditCard(card: string): string {
  return card.replace(/\d(?=\d{4})/g, '*');
}
