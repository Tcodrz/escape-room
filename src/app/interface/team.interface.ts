export interface Team {
    id: string;
    name: string;
    pageID: string;
    started: boolean;
    finished: boolean;
    time?: string;
    finalTime?: string;
    finishedAt?: Date;
    currentQuestion?: number;
    totalQuestions?: number;
}