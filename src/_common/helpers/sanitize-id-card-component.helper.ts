export function sanitizeIdCardComponent<T extends 'split'>(
  string: string,
  split?: T,
): T extends 'split' ? string : string[] {
  const sanitizedString = string.replace(/[\W_]/g, '').toUpperCase();

  return (
    split === 'split'
      ? [
          sanitizedString.slice(0, -1),
          sanitizedString.slice(
            sanitizedString.length - 1,
            sanitizedString.length,
          ),
        ]
      : sanitizedString
  ) as T extends 'split' ? string : string[];
}
