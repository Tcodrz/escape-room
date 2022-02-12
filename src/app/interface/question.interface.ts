export interface Question {
  id: string;
  q: string;
  a: string;
  hints?: string[];
  hint: {
    hint: string;
    penalty: number;
  }
  pageID: string;
}
