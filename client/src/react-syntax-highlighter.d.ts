declare module "react-syntax-highlighter" {
  import { ReactNode } from "react";

  interface SyntaxHighlighterProps {
    language?: string;
    style?: Record<string, Record<string, string>>;
    customStyle?: Record<string, any>;
    codeTagProps?: Record<string, any>;
    lineProps?: Record<string, any> | ((lineNumber: number) => Record<string, any>);
    children: string | ReactNode;
    [key: string]: any;
  }

  export const Prism: React.FC<SyntaxHighlighterProps>;
  export default Prism;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  const oneDark: Record<string, Record<string, string>>;
  export { oneDark };
}
