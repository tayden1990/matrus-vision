import { Question, Choice, Coordinate } from '../api/types';

export const parseQuestions = (analysisResult: any): Question[] => {
    if (!analysisResult.questions) return [];
    
    return analysisResult.questions.map((questionData: any) => ({
        text: questionData.text,
        choices: questionData.choices.map((choice: any) => ({
            text: choice.text,
            coordinate: {
                x: choice.coordinate?.x || 0,
                y: choice.coordinate?.y || 0
            }
        })) as Choice[],
        correctAnswer: questionData.correctAnswer,
        correctCoordinate: questionData.correctCoordinate
    }));
};

export const extractCoordinates = (questions: Question[]): Coordinate[] => {
    return questions
        .map(q => q.correctCoordinate)
        .filter(coord => coord !== undefined) as Coordinate[];
};