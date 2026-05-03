export function resolveInlineEdit(originalTitle, draftTitle) {
  const nextTitle = draftTitle.trim();

  if (!nextTitle) {
    return {
      action: 'cancel',
      title: originalTitle,
    };
  }

  if (nextTitle === originalTitle) {
    return {
      action: 'noop',
      title: originalTitle,
    };
  }

  return {
    action: 'save',
    title: nextTitle,
  };
}
