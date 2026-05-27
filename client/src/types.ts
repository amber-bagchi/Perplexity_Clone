export interface SearchInfo {
  urls?: string[];
  stages?: string[];
  query?: string;
  error?: string;
}

export interface Message {
  id: string;
  content?: string;
  type: "user" | "assistant";
  sections?: Section[];
  searchInfo?: SearchInfo;
  isUser?: boolean;
  isLoading?: boolean;
}

export type Section =
  | { type: "text"; content: string }
  | { type: "code"; language: string; content: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | {
      type: "chart";
      data: any[];
      xKey: string;
      yKey: string;
      chartType: "line" | "bar";
    };
