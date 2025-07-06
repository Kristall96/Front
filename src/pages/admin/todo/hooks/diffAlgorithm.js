export function diffWordsSimple(oldText, newText) {
  const oldWords = (oldText || "").split(/\s+/);
  const newWords = (newText || "").split(/\s+/);
  const m = oldWords.length,
    n = newWords.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // LCS table
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (oldWords[i] === newWords[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  // Walk through diff
  let i = 0,
    j = 0;
  const result = [];
  while (i < m && j < n) {
    if (oldWords[i] === newWords[j]) {
      result.push({ type: "same", value: oldWords[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "removed", value: oldWords[i] });
      i++;
    } else {
      result.push({ type: "added", value: newWords[j] });
      j++;
    }
  }
  // Leftovers
  while (i < m) result.push({ type: "removed", value: oldWords[i++] });
  while (j < n) result.push({ type: "added", value: newWords[j++] });

  return result;
}
