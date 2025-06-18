// admin/components/blocks/BlockRenderer.jsx
import ParagraphBlock from "./blocks/ParagraphBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import QuoteBlock from "./blocks/QuoteBlock";
import ImageBlock from "./blocks/ImageBlock";
import CodeBlock from "./blocks/CodeBlock";
import DividerBlock from "./blocks/DividerBlock";
import RichTextBlock from "./blocks/RichTextBlock";

export default function BlockRenderer({
  block,
  onChange,
  onKeyDown,
  onDelete,
}) {
  const commonProps = { block, onDelete };

  switch (block.type) {
    case "heading":
      return (
        <HeadingBlock
          {...commonProps}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      );

    case "quote":
      return (
        <QuoteBlock
          {...commonProps}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      );

    case "image":
      return <ImageBlock {...commonProps} onChange={onChange} />;

    case "code":
      return <CodeBlock {...commonProps} onChange={onChange} />;

    case "divider":
      return <DividerBlock onDelete={onDelete} />;

    case "richtext":
      return (
        <RichTextBlock
          {...commonProps}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      );

    case "paragraph":
    default:
      return (
        <ParagraphBlock
          {...commonProps}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      );
  }
}
