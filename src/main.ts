import { app, BrowserWindow, ipcMain, Event, shell, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import axios from 'axios';
import { registerShortcuts, unregisterShortcuts } from './capture/shortcutHandler';
import { initializeScreenshotDirectory } from './capture/screenCapture';
import { loadConfig, saveConfig } from './utils/config';
import { OverlayManager } from './overlay/overlayManager';

// Use a global variable instead of extending the app interface
let isQuiting = false;

let mainWindow: BrowserWindow | null;
let overlayManager: OverlayManager | null = null;
let tray: Tray | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        title: 'Screen AI Analyzer',
        show: false, // Don't show immediately
    });

    const config = loadConfig();
    
    // Create the HTML interface with config section
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Screen AI Analyzer</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                max-width: 100%;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 30px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            }
            h1 {
                text-align: center;
                margin-bottom: 30px;
                font-size: 2.5em;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .config-section {
                background: rgba(255, 255, 255, 0.15);
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
            }
            .config-title {
                font-size: 1.3em;
                font-weight: bold;
                margin-bottom: 15px;
                color: #FFD700;
            }
            .input-group {
                margin-bottom: 15px;
            }
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .input-group input {
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                font-size: 1em;
                box-sizing: border-box;
            }
            .shortcut-info {
                background: rgba(255, 255, 255, 0.2);
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                text-align: center;
            }
            .shortcut-keys {
                font-size: 1.5em;
                font-weight: bold;
                color: #FFD700;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .tray-info {
                background: rgba(255, 255, 255, 0.15);
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
                font-size: 0.9em;
            }
            .tray-tip {
                color: #FFD700;
                font-weight: bold;
            }
            .status {
                background: rgba(0, 0, 0, 0.3);
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-weight: bold;
                text-align: center;
            }
            .status.ready { background: rgba(76, 175, 80, 0.3); }
            .status.processing { background: rgba(255, 152, 0, 0.3); }
            .status.error { background: rgba(244, 67, 54, 0.3); }
            .logs-container {
                background: rgba(0, 0, 0, 0.6);
                border-radius: 10px;
                padding: 20px;
                height: 300px;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .logs-header {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 15px;
                color: #FFD700;
            }
            .log-entry {
                margin: 8px 0;
                padding: 8px 12px;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                border-left: 3px solid;
            }
            .log-info { 
                background: rgba(33, 150, 243, 0.2); 
                border-color: #2196F3;
                color: #E3F2FD;
            }
            .log-success { 
                background: rgba(76, 175, 80, 0.2); 
                border-color: #4CAF50;
                color: #E8F5E8;
            }
            .log-warning { 
                background: rgba(255, 152, 0, 0.2); 
                border-color: #FF9800;
                color: #FFF3E0;
            }
            .log-error { 
                background: rgba(244, 67, 54, 0.2); 
                border-color: #F44336;
                color: #FFEBEE;
            }
            .timestamp {
                opacity: 0.7;
                font-size: 0.8em;
            }
            .controls {
                display: flex;
                gap: 15px;
                margin-top: 20px;
                justify-content: center;
                flex-wrap: wrap;
            }
            button {
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                cursor: pointer;
                font-size: 1em;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
            }
            button:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
            button.save {
                background: rgba(76, 175, 80, 0.3);
            }
            button.save:hover {
                background: rgba(76, 175, 80, 0.5);
            }
            .stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-bottom: 20px;
            }
            .stat-card {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 8px;
                text-align: center;
            }
            .stat-number {
                font-size: 1.8em;
                font-weight: bold;
                color: #FFD700;
            }
            .stat-label {
                font-size: 0.9em;
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Screen AI Analyzer</h1>
            
            <div class="config-section">
                <div class="config-title">⚙️ Configuration</div>
                <div class="input-group">
                    <label for="apiKey">OpenAI API Key:</label>
                    <input type="password" id="apiKey" placeholder="sk-..." value="${config.openaiApiKey}">
                </div>
                <div style="text-align: center;">
                    <button class="save" onclick="saveConfig()">💾 Save Configuration</button>
                    <button onclick="testApiKey()">🧪 Test API Key</button>
                </div>
            </div>
            
            <div class="shortcut-info">
                <div>Press the shortcut to capture and analyze your screen:</div>
                <div class="shortcut-keys">Ctrl + Shift + Alt + G</div>
            </div>

            <div class="tray-info">
                <div class="tray-tip">💡 Tip:</div>
                <div>When minimized, look for the 🔍 icon in your system tray</div>
                <div>Right-click the tray icon to restore this window</div>
            </div>

            <div class="status ready" id="status">
                ${config.openaiApiKey ? '✅ Ready - API key configured' : '⚠️ Please configure your OpenAI API key above'}
            </div>

            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number" id="totalCaptures">0</div>
                    <div class="stat-label">Total Captures</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="questionsFound">0</div>
                    <div class="stat-label">Questions Found</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="correctAnswers">0</div>
                    <div class="stat-label">Answers Shown</div>
                </div>
            </div>

            <div class="logs-container">
                <div class="logs-header">📋 Real-time Logs</div>
                <div id="logs"></div>
            </div>

            <div class="controls">
                <button onclick="clearLogs()">Clear Logs</button>
                <button onclick="testCapture()">Test Capture</button>
                <button onclick="openApiKeyPage()">Get API Key</button>
                <button onclick="toggleWindow()">Minimize to Tray</button>
            </div>
        </div>

        <script>
            const { ipcRenderer } = require('electron');
            
            let totalCaptures = 0;
            let questionsFound = 0;
            let correctAnswers = 0;

            function addLog(message, type = 'info') {
                const logsContainer = document.getElementById('logs');
                const timestamp = new Date().toLocaleTimeString();
                
                const logEntry = document.createElement('div');
                logEntry.className = \`log-entry log-\${type}\`;
                logEntry.innerHTML = \`
                    <span class="timestamp">[\${timestamp}]</span> \${message}
                \`;
                
                logsContainer.appendChild(logEntry);
                logsContainer.scrollTop = logsContainer.scrollHeight;
                
                // Keep only last 50 logs
                while (logsContainer.children.length > 51) {
                    logsContainer.removeChild(logsContainer.children[1]);
                }
            }

            function updateStatus(message, type = 'ready') {
                const statusElement = document.getElementById('status');
                statusElement.textContent = message;
                statusElement.className = \`status \${type}\`;
            }

            function updateStats() {
                document.getElementById('totalCaptures').textContent = totalCaptures;
                document.getElementById('questionsFound').textContent = questionsFound;
                document.getElementById('correctAnswers').textContent = correctAnswers;
            }

            function clearLogs() {
                const logsContainer = document.getElementById('logs');
                logsContainer.innerHTML = '<div class="logs-header">📋 Real-time Logs</div>';
                addLog('Logs cleared', 'info');
            }

            function saveConfig() {
                const apiKey = document.getElementById('apiKey').value.trim();
                
                if (!apiKey) {
                    addLog('❌ Please enter an API key', 'error');
                    return;
                }
                
                if (!apiKey.startsWith('sk-')) {
                    addLog('⚠️ API key should start with "sk-"', 'warning');
                }
                
                ipcRenderer.send('save-config', { openaiApiKey: apiKey });
                addLog('✅ Configuration saved successfully', 'success');
                updateStatus('✅ Ready - API key configured', 'ready');
            }

            function testApiKey() {
                const apiKey = document.getElementById('apiKey').value.trim();
                if (!apiKey) {
                    addLog('❌ Please enter an API key first', 'error');
                    return;
                }
                
                addLog('🧪 Testing API key...', 'info');
                ipcRenderer.send('test-api-key', apiKey);
            }

            function testCapture() {
                addLog('Test capture requested by user', 'info');
                ipcRenderer.send('test-capture');
            }

            function openApiKeyPage() {
                ipcRenderer.send('open-url', 'https://platform.openai.com/api-keys');
            }

            function toggleWindow() {
                ipcRenderer.send('toggle-window');
            }

            // Listen for messages from main process
            ipcRenderer.on('log', (event, message, type) => {
                addLog(message, type);
            });

            ipcRenderer.on('status', (event, message, type) => {
                updateStatus(message, type);
            });

            ipcRenderer.on('stats', (event, stats) => {
                totalCaptures = stats.totalCaptures || 0;
                questionsFound = stats.questionsFound || 0;
                correctAnswers = stats.correctAnswers || 0;
                updateStats();
            });

            // Initial log
            addLog('Screen AI Analyzer started successfully', 'success');
            addLog('Global shortcut registered: Ctrl+Shift+Alt+G', 'info');
            addLog('${config.openaiApiKey ? 'API key configured - ready to analyze!' : 'Please configure your OpenAI API key above'}', '${config.openaiApiKey ? 'success' : 'warning'}');
        </script>
    </body>
    </html>
    `;

    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle minimize to system tray behavior
    mainWindow.on('minimize', (event: Event) => {
        event.preventDefault();
        mainWindow?.hide();
        sendLog('Application minimized to system tray', 'info');
        sendLog('💡 Look for the 🔍 icon in your system tray to restore', 'info');
        
        // Show tray notification on first minimize
        if (tray) {
            tray.displayBalloon({
                iconType: 'info',
                title: 'Screen AI Analyzer',
                content: 'App minimized to tray. Right-click the tray icon to restore.'
            });
        }
    });

    // Handle close button (minimize to tray instead of closing)
    mainWindow.on('close', (event: Event) => {
        if (!isQuiting) {
            event.preventDefault();
            mainWindow?.hide();
            sendLog('Application hidden to system tray (use Exit to fully close)', 'info');
        }
    });
}

function createTray() {
    try {
        // Try to create icon from canvas
        const textIcon = nativeImage.createFromBuffer(createIconBuffer());
        tray = new Tray(textIcon);
    } catch (error) {
        // Fallback to a simple icon if canvas fails
        sendLog('Canvas not available, using fallback icon', 'warning');
        const fallbackIcon = nativeImage.createEmpty();
        tray = new Tray(fallbackIcon);
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '🔍 Screen AI Analyzer',
            enabled: false
        },
        {
            type: 'separator'
        },
        {
            label: '📱 Show Window',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    if (mainWindow.isMinimized()) {
                        mainWindow.restore();
                    }
                    mainWindow.focus();
                    sendLog('Window restored from system tray', 'info');
                }
            }
        },
        {
            label: '📷 Take Screenshot (Ctrl+Shift+Alt+G)',
            click: () => {
                sendLog('Screenshot triggered from tray menu', 'info');
                // You can trigger the screenshot handler here if needed
            }
        },
        {
            type: 'separator'
        },
        {
            label: '⚙️ Configuration',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        {
            type: 'separator'
        },
        {
            label: '❌ Exit',
            click: () => {
                isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Screen AI Analyzer - Ready');
    tray.setContextMenu(contextMenu);

    // Double-click tray icon to show window
    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });

    sendLog('✅ System tray icon created', 'success');
}

// Create a simple icon buffer (basic circle with text)
function createIconBuffer(): Buffer {
    const canvas = require('canvas');
    const { createCanvas } = canvas;
    
    const size = 32;
    const canvasEl = createCanvas(size, size);
    const ctx = canvasEl.getContext('2d');
    
    // Draw background circle
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔍', size/2, size/2);
    
    return canvasEl.toBuffer('image/png');
}

// Global variables for stats
let appStats = {
    totalCaptures: 0,
    questionsFound: 0,
    correctAnswers: 0
};

// Helper functions to send messages to renderer
export const sendLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('log', message, type);
    }
};

export const updateStatus = (message: string, type: 'ready' | 'processing' | 'error' = 'ready') => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('status', message, type);
    }
    
    // Update tray tooltip
    if (tray) {
        tray.setToolTip(`Screen AI Analyzer - ${message}`);
    }
};

export const updateStats = (newStats: Partial<typeof appStats>) => {
    appStats = { ...appStats, ...newStats };
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('stats', appStats);
    }
};

export const getOverlayManager = (): OverlayManager => {
    if (!overlayManager) {
        overlayManager = new OverlayManager();
    }
    return overlayManager;
};

// IPC handlers
ipcMain.on('test-capture', () => {
    sendLog('Test capture initiated...', 'info');
});

ipcMain.on('toggle-window', () => {
    if (mainWindow) {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
            sendLog('Window hidden to system tray', 'info');
        } else {
            mainWindow.show();
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
            sendLog('Window restored from system tray', 'info');
        }
    }
});

ipcMain.on('save-config', (event, configData) => {
    const currentConfig = loadConfig();
    const newConfig = { ...currentConfig, ...configData };
    saveConfig(newConfig);
    sendLog('Configuration saved successfully', 'success');
});

ipcMain.on('test-api-key', async (event, apiKey: string) => {
    try {
        sendLog('Testing API key...', 'info');
        
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 5
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        sendLog('✅ API key is valid and working!', 'success');
        
        try {
            sendLog('🔍 Testing vision models availability...', 'info');
            const visionResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o',
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Test' },
                        { 
                            type: 'image_url', 
                            image_url: { 
                                url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' 
                            } 
                        }
                    ]
                }],
                max_tokens: 5
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            });
            
            sendLog('✅ Vision models are available and working!', 'success');
        } catch (visionError: any) {
            if (visionError.response?.status === 404) {
                sendLog('⚠️ gpt-4o vision model not available, will try alternatives', 'warning');
            } else {
                sendLog(`⚠️ Vision model test failed: ${visionError.message}`, 'warning');
            }
        }
        
    } catch (error: any) {
        if (error.response?.status === 401) {
            sendLog('❌ Invalid API key', 'error');
        } else if (error.response?.status === 429) {
            sendLog('✅ API key is valid (rate limited)', 'success');
        } else if (error.response?.status === 404) {
            sendLog('⚠️ Some models may not be available with this API key', 'warning');
        } else {
            sendLog(`❌ Error testing API key: ${error.message}`, 'error');
        }
    }
});

ipcMain.on('open-url', (event, url: string) => {
    shell.openExternal(url);
});

ipcMain.on('close-overlay', () => {
    sendLog('🔒 Overlay close signal received', 'info');
    if (overlayManager) {
        overlayManager.hideOverlay();
    }
});

app.on('ready', async () => {
    createWindow();
    createTray();
    
    overlayManager = new OverlayManager();
    
    sendLog('Initializing screenshot directory...', 'info');
    await initializeScreenshotDirectory();
    sendLog('Screenshot directory initialized', 'success');
    
    sendLog('Registering global shortcuts...', 'info');
    registerShortcuts();
    sendLog('Global shortcuts registered successfully', 'success');
    
    updateStatus('✅ Ready - Waiting for screenshot command', 'ready');
    sendLog('Screen AI Analyzer is ready to use!', 'success');
});

app.on('before-quit', () => {
    isQuiting = true;
    sendLog('Application shutting down...', 'warning');
    unregisterShortcuts();
    
    if (overlayManager) {
        overlayManager.destroy();
        overlayManager = null;
    }
    
    if (tray) {
        tray.destroy();
        tray = null;
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Don't quit, just hide to tray
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    } else {
        mainWindow.show();
    }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });
}