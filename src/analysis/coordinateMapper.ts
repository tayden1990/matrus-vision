export interface Coordinate {
    x: number;
    y: number;
}

export interface AnswerCoordinates {
    questionId: string;
    correctAnswer: string;
    coordinates: Coordinate[];
}

export function mapCoordinates(questions: any[], screenWidth: number, screenHeight: number): AnswerCoordinates[] {
    const answerCoordinates: AnswerCoordinates[] = [];

    questions.forEach((question, index) => {
        const { id, correctAnswer, options } = question;
        const optionIndex = options.indexOf(correctAnswer);

        if (optionIndex !== -1) {
            const x = (screenWidth / options.length) * optionIndex + (screenWidth / (options.length * 2));
            const y = (screenHeight / questions.length) * index + (screenHeight / (questions.length * 2));

            answerCoordinates.push({
                questionId: id,
                correctAnswer: correctAnswer,
                coordinates: [{ x, y }]
            });
        }
    });

    return answerCoordinates;
}