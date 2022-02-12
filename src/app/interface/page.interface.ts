import { Question } from "./question.interface";

export interface Page {
  id: string;
  questions: Question[];
  name: string;
  code: string;
}
