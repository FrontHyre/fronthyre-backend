function parseCommaSeparatedSkills(value) {
  if (value === undefined || value === null || value === '') {
    return { text: null, json: null };
  }

  const items = String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (items.length === 0) {
    return { text: null, json: null };
  }

  const normalized = items.map((s) => s.toLowerCase());
  return {
    text: items.join(', '),
    json: JSON.stringify(normalized)
  };
}

module.exports = { parseCommaSeparatedSkills };
