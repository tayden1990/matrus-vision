import { desktopCapturer, screen } from 'electron';
import { promises as fs } from 'fs';
import { join } from 'path';
import { app } from 'electron';
import { sendLog } from '../main';

const screenshotDir = join(app.getPath('pictures'), 'ScreenAIAnalyzer');

export const captureScreen = async (): Promise<string> => {
    try {
        // Get the primary display dimensions
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.bounds;
        
        console.log(`Capturing screen at resolution: ${width}x${height}`);

        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: {
                width: width,
                height: height
            }
        });

        if (sources.length === 0) {
            throw new Error('No screen sources found');
        }

        const screenSource = sources[0];
        
        // Get the full resolution image instead of thumbnail
        const image = screenSource.thumbnail;
        
        // Ensure we have the correct size
        console.log(`Captured image size: ${image.getSize().width}x${image.getSize().height}`);
        
        const imageBuffer = image.toPNG();
        const filePath = join(screenshotDir, `screenshot-${Date.now()}.png`);

        await fs.writeFile(filePath, imageBuffer);
        console.log('High-resolution screenshot saved to:', filePath);
        console.log('Image buffer size:', imageBuffer.length, 'bytes');
        
        return filePath;
    } catch (error) {
        console.error('Failed to capture screen:', error);
        throw error;
    }
};

export const captureFullScreen = async (): Promise<string> => {
    try {
        // Get display information
        const displays = screen.getAllDisplays();
        const primaryDisplay = displays.find(display => display.bounds.x === 0 && display.bounds.y === 0) || displays[0];
        
        sendLog(`🖥️ Detected ${displays.length} display(s)`, 'info');
        sendLog(`📐 Primary display: ${primaryDisplay.size.width}x${primaryDisplay.size.height} (Scale: ${primaryDisplay.scaleFactor}x)`, 'info');
        
        const captureWidth = primaryDisplay.size.width * primaryDisplay.scaleFactor;
        const captureHeight = primaryDisplay.size.height * primaryDisplay.scaleFactor;
        
        sendLog(`📸 Capturing at resolution: ${captureWidth}x${captureHeight}`, 'info');

        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: {
                width: captureWidth,
                height: captureHeight
            }
        });

        if (sources.length === 0) {
            throw new Error('No screen sources available for capture');
        }

        sendLog(`🔍 Found ${sources.length} screen source(s)`, 'info');

        const screenSource = sources.find(source => source.display_id === primaryDisplay.id.toString()) || sources[0];
        sendLog(`✅ Selected screen source: ${screenSource.name}`, 'info');
        
        const image = screenSource.thumbnail;
        const actualSize = image.getSize();
        
        sendLog(`📏 Captured image dimensions: ${actualSize.width}x${actualSize.height}`, 'success');
        
        const imageBuffer = image.toPNG();
        const filePath = join(screenshotDir, `screenshot-${Date.now()}.png`);

        await fs.writeFile(filePath, imageBuffer);
        
        const fileSizeKB = Math.round(imageBuffer.length / 1024);
        sendLog(`💾 Screenshot saved successfully (${fileSizeKB} KB)`, 'success');
        sendLog(`📂 File location: ${filePath}`, 'info');
        
        return filePath;
    } catch (error: any) {
        sendLog(`❌ Screen capture failed: ${error.message}`, 'error');
        throw error;
    }
};

export const initializeScreenshotDirectory = async (): Promise<void> => {
    try {
        await fs.access(screenshotDir);
        sendLog(`📁 Screenshot directory exists: ${screenshotDir}`, 'info');
    } catch {
        await fs.mkdir(screenshotDir, { recursive: true });
        sendLog(`📁 Created screenshot directory: ${screenshotDir}`, 'success');
    }
};