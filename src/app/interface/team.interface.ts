export interface Team {
  id: string;
  name: string;
  pageID: string;
  started: boolean;
  finished: boolean;
  timer?: {
    time: string;
    timestamp: number;
  };
  finalTime?: string;
  finishedAt?: Date;
  currentQuestion?: number;
  totalQuestions?: number;
}
