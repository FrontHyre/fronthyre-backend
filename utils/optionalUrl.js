const { pushError, label } = require('./validationErrors');

const EMPTY_URL_PLACEHOLDERS = new Set([
  'na',
  'n/a',
  'n.a',
  'none',
  'nil',
  '-',
  '--',
  'no',
  'not applicable'
]);

function optionalUrl(value, field, errors) {
  if (value === undefined || value === null || value === '') return null;

  const trimmed = String(value).trim();
  if (!trimmed) return null;
  if (EMPTY_URL_PLACEHOLDERS.has(trimmed.toLowerCase())) return null;

  try {
    const url = new URL(trimmed);
    if (!['http:', 'https:'].includes(url.protocol)) {
      pushError(
        errors,
        field,
        `${label(field)} must start with http:// or https://.`
      );
      return null;
    }
    return url.toString();
  } catch {
    pushError(
      errors,
      field,
      `${label(field)} must be a valid link (e.g. https://example.com), or leave blank.`
    );
    return null;
  }
}

module.exports = { optionalUrl };
