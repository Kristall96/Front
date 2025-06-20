// admin/config/layoutPresets.js
import { generateId } from "../../../utils/generateId.js";

const createId = () => generateId();

export const layoutPresets = [
  {
    label: "🪟 2 Column Layout",
    description: "Two equal-width columns",
    blocks: [
      {
        id: createId(),
        type: "group",
        layout: "flex",
        children: [
          {
            id: createId(),
            type: "column",
            width: "50%",
            children: [
              {
                id: createId(),
                type: "paragraph",
                content: "Left column content",
              },
            ],
          },
          {
            id: createId(),
            type: "column",
            width: "50%",
            children: [
              {
                id: createId(),
                type: "paragraph",
                content: "Right column content",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "📣 Hero Section",
    description: "Full-width heading and text",
    blocks: [
      {
        id: createId(),
        type: "group",
        layout: "vertical",
        children: [
          {
            id: createId(),
            type: "heading",
            content: "Welcome to our site!",
          },
          {
            id: createId(),
            type: "paragraph",
            content: "This is a hero description. Customize it.",
          },
        ],
      },
    ],
  },
];
