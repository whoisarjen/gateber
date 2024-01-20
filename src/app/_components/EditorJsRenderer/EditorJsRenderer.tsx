import { type OutputData } from "@editorjs/editorjs";
import React from "react";
import editorJsHtml from 'editorjs-html'

const EditorJsToHtml = editorJsHtml();

type Props = {
  data: OutputData;
};

type ParsedContent = string | JSX.Element;

export const EditorJsRenderer = ({ data }: Props) => {
  const html = EditorJsToHtml.parse(data) as ParsedContent[]

  return (
    //✔️ It's important to add key={data.time} here to re-render based on the latest data.
    <div className="prose max-w-full" key={data.time}>
      {html.map((item, index) => {
        if (typeof item === "string") {
          return (
            <div dangerouslySetInnerHTML={{ __html: item }} key={index}></div>
          );
        }

        console.log({ item })
        return item;
      })}
    </div>
  );
};
