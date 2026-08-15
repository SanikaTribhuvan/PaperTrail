const DOCS_KEY = 'papertrail_documents';
const CHECKPOINTS_KEY = 'papertrail_checkpoints';

export function loadDocuments() {
  try {
    const data = localStorage.getItem(DOCS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDocuments(docs) {
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}

export function loadCheckpoints() {
  try {
    const data = localStorage.getItem(CHECKPOINTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCheckpoints(records) {
  localStorage.setItem(CHECKPOINTS_KEY, JSON.stringify(records));
}

export function clearAllData() {
  localStorage.removeItem(DOCS_KEY);
  localStorage.removeItem(CHECKPOINTS_KEY);
}
