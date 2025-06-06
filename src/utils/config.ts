import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';

interface Config {
    openaiApiKey: string;
    model: string;
    autoHideDelay: number;
    systemPrompt: string;
}

const defaultConfig: Config = {
    openaiApiKey: '',
    model: 'gpt-4o',
    autoHideDelay: 10000,
    systemPrompt: `You are an expert exam assistant. Analyze screenshots to find multiple choice questions and provide correct answers based on your knowledge. Focus on accuracy and provide precise coordinates for UI automation.`
};

const configPath = join(app.getPath('userData'), 'config.json');

export const loadConfig = (): Config => {
    try {
        if (existsSync(configPath)) {
            const configData = readFileSync(configPath, 'utf8');
            return { ...defaultConfig, ...JSON.parse(configData) };
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
    
    // Create default config file if it doesn't exist
    saveConfig(defaultConfig);
    return defaultConfig;
};

export const saveConfig = (config: Config): void => {
    try {
        writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Error saving config:', error);
    }
};

export const getOpenAIApiKey = (): string => {
    const config = loadConfig();
    return config.openaiApiKey || process.env.OPENAI_API_KEY || '';
};

// Application configuration (no sensitive data)
export const appConfig = {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    screenshotQuality: 80,
    overlayOpacity: 0.7,
    shortcut: {
        key: 'g',
        modifiers: ['Shift', 'Control', 'Alt']
    }
};