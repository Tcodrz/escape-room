export interface Question {
  id: string;
  q: string;
  a: string;
  hint: {
    hint: string;
    penalty: number;
    extra?: string;
  }
  pageID: string;
  number: number;
}
