import { globalShortcut } from 'electron';
import { captureScreen } from './screenCapture';
import { analyzeImage } from '../api/chatgptClient';
import { sendLog, updateStatus, updateStats, getOverlayManager } from '../main';

export const registerShortcuts = (): void => {
    const shortcut = 'CommandOrControl+Shift+Alt+G';
    
    const success = globalShortcut.register(shortcut, async () => {
        sendLog('📷 Screenshot shortcut activated!', 'info');
        await handleScreenshot();
    });

    if (success) {
        sendLog(`✅ Global shortcut ${shortcut} registered successfully`, 'success');
        sendLog('🎯 Ready to capture! Press Ctrl+Shift+Alt+G anywhere on your screen', 'info');
    } else {
        sendLog(`❌ Failed to register global shortcut ${shortcut}`, 'error');
    }
};

export const unregisterShortcuts = (): void => {
    globalShortcut.unregisterAll();
    sendLog('🔓 Global shortcuts unregistered', 'info');
};

const handleScreenshot = async (): Promise<void> => {
    try {
        updateStatus('📷 Capturing screenshot...', 'processing');
        sendLog('Initializing screen capture...', 'info');
        
        // Capture screenshot
        const imagePath = await captureScreen();
        sendLog(`✅ Screenshot captured successfully: ${imagePath}`, 'success');
        
        updateStatus('🤖 Analyzing with AI...', 'processing');
        sendLog('📤 Sending image to ChatGPT Vision API...', 'info');
        sendLog('⏳ Please wait while AI analyzes the content...', 'warning');
        
        // Analyze with ChatGPT
        const analysis = await analyzeImage(imagePath);
        sendLog('✅ ChatGPT analysis completed', 'success');
        sendLog(`📋 Analysis result received: ${JSON.stringify(analysis).substring(0, 100)}...`, 'info');
        
        // Process results
        sendLog('🔍 Parsing questions and answers...', 'info');
        const questions = analysis.questions || [];
        
        if (questions.length === 0) {
            sendLog('⚠️ No multiple choice questions found in the image', 'warning');
            updateStatus('⚠️ No questions detected', 'ready');
            return;
        }
        
        sendLog(`✅ Found ${questions.length} questions in the image`, 'success');
        
        // Count correct answers
        const correctAnswers = questions.filter((q: any) => q.correctAnswer).length;
        sendLog(`✅ Identified ${correctAnswers} correct answer coordinates`, 'success');
        
        // Update stats
        updateStats({
            totalCaptures: 1,
            questionsFound: questions.length,
            correctAnswers: correctAnswers
        });
        
        // Show overlay with answers
        sendLog('🎨 Creating overlay with answer indicators...', 'info');
        const overlayManager = getOverlayManager();
        await overlayManager.showCorrectAnswers(questions);
        
        updateStatus('✅ Analysis complete - Answers displayed', 'ready');
        sendLog('🎉 Screenshot analysis completed successfully!', 'success');
        
    } catch (error: any) {
        sendLog(`❌ Error in screenshot process: ${error.message}`, 'error');
        sendLog(`🔧 Full error details: ${error.stack || error}`, 'error');
        updateStatus('❌ Analysis failed', 'error');
    }
};