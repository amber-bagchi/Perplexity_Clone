export interface SearchInfo {
  urls?: string[];
}

export interface Message {
  id: string;
  type: "user" | "assistant";
  sections?: Section[]; // structured sections
  searchInfo?: SearchInfo;
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
