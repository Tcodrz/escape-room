export interface Team {
    id: string;
    name: string;
    pageID: string;
    finished: boolean;
    finalTime?: string;
    finishedAt?: Date;
    started: boolean;
    currentQuestion?: number;
    totalQuestions?: number;
}