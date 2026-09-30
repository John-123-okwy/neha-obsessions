export function calculateCustomizationTotal(basePrice, groups, selections) {
  let total = Number(basePrice) || 0;
  for (const group of groups) {
    const selectedOptionId = selections[group.id];
    if (!selectedOptionId) continue;
    const option = group.options.find((o) => o.id === selectedOptionId);
    if (option) total += Number(option.priceDelta) || 0;
  }
  return total;
}

export function buildCustomizationSummary(groups, selections) {
  return groups
    .map((group) => {
      const option = group.options.find((o) => o.id === selections[group.id]);
      if (!option) return null;
      return {
        groupId: group.id,
        groupName: group.name,
        optionId: option.id,
        optionLabel: option.label,
        priceDelta: Number(option.priceDelta) || 0,
        requiresConfirmation: !!option.requiresConfirmation,
      };
    })
    .filter(Boolean);
}

export function generateCartItemKey(productId, summary, message) {
  const parts = summary.map((s) => `${s.groupId}:${s.optionId}`).sort().join("|");
  const msgPart = message ? `msg:${message.slice(0, 30)}` : "";
  return `${productId}::${parts}::${msgPart}`;
}