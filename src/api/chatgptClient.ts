import axios from 'axios';
import { ChatGPTResponse, ChatGPTMessage } from './types';
import { getOpenAIApiKey } from '../utils/config';
import { sendLog } from '../main';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzeImage = async (imagePath: string): Promise<any> => {
    const apiKey = getOpenAIApiKey();
    
    if (!apiKey) {
        const errorMsg = 'OpenAI API key not configured. Please set your API key in the config.';
        sendLog(errorMsg, 'error');
        sendLog('💡 You can get an API key from: https://platform.openai.com/api-keys', 'warning');
        throw new Error(errorMsg);
    }

    try {
        sendLog(`🔑 Using API key: ${apiKey.substring(0, 8)}...`, 'info');
        
        const imageBase64 = require('fs').readFileSync(imagePath, 'base64');
        const imageSizeKB = Math.round(imageBase64.length / 1024 * 0.75); // Base64 is ~33% larger
        
        sendLog(`📤 Sending ${imageSizeKB} KB image to OpenAI Vision API...`, 'info');
        
        // According to OpenAI docs, this is the correct format
        const messages = [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Analyze this screenshot and identify all multiple choice questions visible. For each question:

1. Extract the exact question text
2. List all answer choices with their text
3. Determine the correct answer based on your knowledge
4. Provide approximate screen coordinates for clickable areas

Return ONLY a valid JSON response in this exact format:
{
  "questions": [
    {
      "id": 1,
      "text": "Question text here",
      "choices": [
        {
          "letter": "A",
          "text": "Choice A text",
          "coordinate": {"x": 100, "y": 200}
        },
        {
          "letter": "B", 
          "text": "Choice B text",
          "coordinate": {"x": 100, "y": 250}
        }
      ],
      "correctAnswer": "A",
      "correctText": "Choice A text",
      "correctCoordinate": {"x": 100, "y": 200},
      "confidence": "high"
    }
  ],
  "totalQuestions": 1
}

Be precise with coordinates - they should point to clickable areas. If no questions are found, return {"questions": [], "totalQuestions": 0}.`
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/png;base64,${imageBase64}`,
                            detail: "high" // Use high detail for better OCR
                        }
                    }
                ]
            }
        ];

        sendLog('🤖 Sending request to OpenAI Vision API...', 'info');
        
        // Try gpt-4o first (recommended model), then gpt-4o-mini as fallback
        const models = ['gpt-4o', 'gpt-4o-mini'];
        let lastError: any = null;
        
        for (const model of models) {
            try {
                sendLog(`🔄 Trying model: ${model}`, 'info');
                
                const response = await axios.post(OPENAI_API_URL, {
                    model: model,
                    messages: messages,
                    max_tokens: 4000,
                    temperature: 0.1, // Low temperature for consistent results
                    response_format: { type: "json_object" } // Force JSON response
                }, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 120000 // 2 minute timeout
                });

                sendLog(`✅ Success with model: ${model}`, 'success');
                
                const content = response.data.choices[0].message.content;
                sendLog(`📄 Response content length: ${content.length} characters`, 'info');
                
                try {
                    const parsedResponse = JSON.parse(content);
                    const questionCount = parsedResponse.questions?.length || 0;
                    sendLog(`🎯 Parsed response with ${questionCount} questions found`, 'success');
                    
                    // Log found questions for debugging
                    if (questionCount > 0) {
                        parsedResponse.questions.forEach((q: any, index: number) => {
                            sendLog(`📝 Q${index + 1}: "${q.text?.substring(0, 50)}..." - Correct: ${q.correctAnswer}`, 'info');
                        });
                    }
                    
                    return parsedResponse;
                } catch (parseError) {
                    sendLog('❌ Failed to parse JSON response from OpenAI', 'error');
                    sendLog(`Raw response: ${content.substring(0, 200)}...`, 'warning');
                    
                    // Return error structure
                    return {
                        questions: [],
                        totalQuestions: 0,
                        error: 'Failed to parse AI response',
                        raw_response: content
                    };
                }
                
            } catch (error: any) {
                lastError = error;
                
                if (error.response?.status === 404) {
                    sendLog(`❌ Model ${model} not available, trying next...`, 'warning');
                    continue; // Try next model
                } else if (error.response?.status === 400) {
                    sendLog(`❌ Bad request with ${model}: ${error.response?.data?.error?.message || error.message}`, 'error');
                    continue; // Try next model
                } else {
                    throw error; // Other errors should be handled below
                }
            }
        }
        
        // If we get here, all models failed
        throw lastError || new Error('All vision models unavailable');
        
    } catch (error: any) {
        if (error.response?.status === 401) {
            sendLog('❌ Invalid OpenAI API key - please check your configuration', 'error');
            sendLog('💡 Get a valid API key from: https://platform.openai.com/api-keys', 'warning');
        } else if (error.response?.status === 404) {
            sendLog('❌ Vision models not available - check your OpenAI plan', 'error');
            sendLog('💡 Vision models require a paid OpenAI plan', 'warning');
        } else if (error.response?.status === 429) {
            sendLog('⚠️ Rate limit exceeded - please wait and try again', 'warning');
        } else if (error.response?.status === 400) {
            const errorMsg = error.response?.data?.error?.message || 'Bad request';
            sendLog(`❌ Bad request: ${errorMsg}`, 'error');
        } else if (error.code === 'ENOTFOUND') {
            sendLog('❌ Network error - check your internet connection', 'error');
        } else if (error.code === 'ECONNABORTED') {
            sendLog('⚠️ Request timeout - the image analysis took too long', 'warning');
        } else {
            sendLog(`❌ Error analyzing image: ${error.message}`, 'error');
            if (error.response?.data) {
                sendLog(`📋 Error details: ${JSON.stringify(error.response.data, null, 2)}`, 'error');
            }
        }
        throw error;
    }
};