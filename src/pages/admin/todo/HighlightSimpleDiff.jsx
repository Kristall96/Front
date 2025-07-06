import { diffWordsSimple } from "./hooks/diffAlgorithm";

export default function HighlightSimpleDiff({ oldText, newText, type }) {
  const diff = diffWordsSimple(oldText, newText);

  return (
    <span>
      {diff.map((part, idx) => {
        if (type === "old") {
          if (part.type === "removed") {
            return (
              <span
                key={idx}
                className="bg-rose-900/80 text-rose-300 rounded px-0.5"
              >
                {part.value + " "}
              </span>
            );
          }
          if (part.type === "same") {
            return <span key={idx}>{part.value + " "}</span>;
          }
          // Ignore "added" words on the old side
          return null;
        } else {
          // type === "new"
          if (part.type === "added") {
            return (
              <span
                key={idx}
                className="bg-green-900/80 text-green-300 rounded px-0.5"
              >
                {part.value + " "}
              </span>
            );
          }
          if (part.type === "same") {
            return <span key={idx}>{part.value + " "}</span>;
          }
          // Ignore "removed" words on the new side
          return null;
        }
      })}
    </span>
  );
}
