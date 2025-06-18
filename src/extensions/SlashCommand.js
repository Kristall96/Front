// src/extensions/SlashCommand.jsx
import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

export const SlashCommand = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        allowSpaces: false,
        command: ({ editor, item }) => {
          item.command(editor);
        },
        items: ({ query }) => {
          return [
            {
              title: "Heading 1",
              command: (editor) =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            },
            {
              title: "Heading 2",
              command: (editor) =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            },
            {
              title: "Bullet List",
              command: (editor) =>
                editor.chain().focus().toggleBulletList().run(),
            },
            {
              title: "Code Block",
              command: (editor) =>
                editor.chain().focus().toggleCodeBlock().run(),
            },
            {
              title: "Paragraph",
              command: (editor) => editor.chain().focus().setParagraph().run(),
            },
          ].filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase())
          );
        },
        render: () => {
          let component;
          let popup;

          return {
            onStart: (props) => {
              component = document.createElement("div");
              component.className =
                "absolute bg-white border rounded shadow z-50";
              updateComponent(props);
              popup = document.body.appendChild(component);
            },
            onUpdate: (props) => updateComponent(props),
            onExit: () => {
              if (popup) popup.remove();
            },
          };

          function updateComponent({ items, command, clientRect }) {
            if (!clientRect || !items.length) return;
            component.innerHTML = "";

            items.forEach((item) => {
              const el = document.createElement("div");
              el.className = "p-2 cursor-pointer hover:bg-blue-100";
              el.textContent = item.title;
              el.onclick = () => command(item);
              component.appendChild(el);
            });

            Object.assign(component.style, {
              top: `${clientRect().bottom + window.scrollY}px`,
              left: `${clientRect().left + window.scrollX}px`,
              position: "absolute",
            });
          }
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [Suggestion(this.options.suggestion)];
  },
});
