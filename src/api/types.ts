export interface ApiRequest {
    image: string; // Base64 encoded image
}

export interface ApiResponse {
    questions: Question[];
    analysis: string;
}

export interface Question {
    text: string; // The question text
    choices: Choice[]; // List of multiple-choice answers
    correctAnswer: string; // The correct answer to the question
    correctCoordinate?: Coordinate; // Optional coordinates for the correct answer on the screen
}

export interface Choice {
    text: string; // The choice text
    coordinate: Coordinate; // Coordinates for the choice on the screen
}

export interface Coordinate {
    x: number; // X coordinate
    y: number; // Y coordinate
}

export interface ChatGPTResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export interface ChatGPTMessage {
    role: 'user' | 'assistant' | 'system';
    content: Array<{
        type: 'text' | 'image_url';
        text?: string;
        image_url?: {
            url: string;
        };
    }>;
}