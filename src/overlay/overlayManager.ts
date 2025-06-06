import { BrowserWindow, screen } from 'electron';
import { sendLog } from '../main';

export class OverlayManager {
    private overlayWindow: BrowserWindow | null = null;

    async showCorrectAnswers(questions: any[]): Promise<void> {
        try {
            sendLog('🎯 Creating answer overlay window...', 'info');
            
            if (questions.length === 0) {
                sendLog('⚠️ No questions found to display', 'warning');
                return;
            }

            // Close existing overlay if any
            this.hideOverlay();

            // Get primary display dimensions
            const primaryDisplay = screen.getPrimaryDisplay();
            const { width, height } = primaryDisplay.workAreaSize;

            // Create overlay window
            this.overlayWindow = new BrowserWindow({
                width: width,
                height: height,
                x: 0,
                y: 0,
                frame: false,
                transparent: true,
                alwaysOnTop: true,
                skipTaskbar: true,
                resizable: false,
                movable: false,
                focusable: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });

            // Handle window closed event
            this.overlayWindow.on('closed', () => {
                this.overlayWindow = null;
            });

            // Generate HTML content for overlay
            const overlayHTML = this.generateOverlayHTML(questions, width, height);
            
            // Load the overlay content
            await this.overlayWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(overlayHTML));
            
            sendLog(`✅ Overlay created with ${questions.length} answer(s)`, 'success');
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                this.hideOverlay();
            }, 10000);

        } catch (error: any) {
            sendLog(`❌ Error creating overlay: ${error.message}`, 'error');
            throw error;
        }
    }

    private generateOverlayHTML(questions: any[], screenWidth: number, screenHeight: number): string {
        const arrows = questions.map((question, index) => {
            const answer = question.correctCoordinate || question.choices?.[0]?.coordinate || { x: 500, y: 400 };
            const questionText = question.text?.substring(0, 100) || `Question ${index + 1}`;
            const correctAnswer = question.correctAnswer || question.correctText || 'Unknown';
            
            sendLog(`📍 Answer ${index + 1}: Position (${answer.x}, ${answer.y}) - ${correctAnswer}`, 'success');
            
            return `
                <div class="answer-indicator" style="left: ${answer.x - 25}px; top: ${answer.y - 25}px;">
                    <div class="arrow-circle">
                        <div class="arrow-text">${correctAnswer}</div>
                    </div>
                    <div class="question-tooltip">
                        <div class="tooltip-text">${questionText}...</div>
                        <div class="tooltip-answer">Correct: ${correctAnswer}</div>
                    </div>
                </div>
            `;
        }).join('');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    width: 100vw;
                    height: 100vh;
                    background: transparent;
                    overflow: hidden;
                    pointer-events: none;
                    font-family: 'Segoe UI', sans-serif;
                }
                
                .answer-indicator {
                    position: absolute;
                    pointer-events: none;
                    z-index: 9999;
                    animation: pulseGlow 2s infinite;
                }
                
                .arrow-circle {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(45deg, #00ff88, #00cc6a);
                    border: 3px solid #ffffff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.6);
                    position: relative;
                }
                
                .arrow-text {
                    color: white;
                    font-weight: bold;
                    font-size: 18px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                }
                
                .question-tooltip {
                    position: absolute;
                    top: -80px;
                    left: 60px;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 8px;
                    min-width: 200px;
                    max-width: 400px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.2);
                    opacity: 0;
                    transform: translateY(10px);
                    animation: slideIn 0.5s ease-out 1s forwards;
                }
                
                .tooltip-text {
                    font-size: 12px;
                    line-height: 1.4;
                    margin-bottom: 5px;
                    opacity: 0.9;
                }
                
                .tooltip-answer {
                    font-size: 14px;
                    font-weight: bold;
                    color: #00ff88;
                }
                
                @keyframes pulseGlow {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 20px rgba(0, 255, 136, 0.6);
                    }
                    50% {
                        transform: scale(1.1);
                        box-shadow: 0 0 30px rgba(0, 255, 136, 0.8);
                    }
                }
                
                @keyframes slideIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .fade-out {
                    animation: fadeOut 1s ease-out forwards;
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
            </style>
        </head>
        <body>
            ${arrows}
            
            <script>
                // Auto fade out after 8 seconds
                setTimeout(() => {
                    document.body.classList.add('fade-out');
                }, 8000);
                
                // Send close signal after fade
                setTimeout(() => {
                    const { ipcRenderer } = require('electron');
                    ipcRenderer.send('close-overlay');
                }, 9000);
            </script>
        </body>
        </html>
        `;
    }

    hideOverlay(): void {
        if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
            sendLog('🔒 Hiding answer overlay', 'info');
            this.overlayWindow.close();
            this.overlayWindow = null;
        }
    }

    // Add the missing destroy method
    destroy(): void {
        sendLog('🗑️ Destroying overlay manager...', 'info');
        this.hideOverlay();
    }

    // Check if overlay is currently visible
    isVisible(): boolean {
        return this.overlayWindow !== null && !this.overlayWindow.isDestroyed();
    }
}