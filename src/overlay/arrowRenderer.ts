import { sendLog } from '../main';
import { Coordinate } from '../api/types';

export class ArrowRenderer {
    private overlay: HTMLElement | null = null;

    createOverlay(): void {
        this.overlay = document.createElement('div');
        this.overlay.id = 'screen-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: transparent;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(this.overlay);
    }

    renderArrows(coordinates: Coordinate[]): void {
        sendLog('🎯 Rendering answer arrows...', 'info');
        
        if (!coordinates || coordinates.length === 0) {
            sendLog('⚠️ No coordinates to render arrows for', 'warning');
            return;
        }

        // Log the coordinates we're about to show
        coordinates.forEach((coord, index) => {
            sendLog(`📍 Coordinate ${index + 1}: Position (${coord.x}, ${coord.y})`, 'success');
        });
        
        sendLog(`✅ Prepared ${coordinates.length} arrow indicator(s) for display`, 'success');

        if (!this.overlay) this.createOverlay();
        
        // Clear existing arrows
        this.overlay!.innerHTML = '';

        coordinates.forEach((coord, index) => {
            const arrow = this.createArrowElement(coord, index);
            this.overlay!.appendChild(arrow);
        });
    }

    private createArrowElement(coordinate: Coordinate, index: number): HTMLElement {
        const arrow = document.createElement('div');
        arrow.className = 'answer-arrow';
        arrow.style.cssText = `
            position: absolute;
            left: ${coordinate.x - 30}px;
            top: ${coordinate.y - 30}px;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 30px solid #ff0000;
            pointer-events: none;
            z-index: 10000;
        `;
        
        // Add a label
        const label = document.createElement('div');
        label.textContent = `${index + 1}`;
        label.style.cssText = `
            position: absolute;
            top: 35px;
            left: -10px;
            background: #ff0000;
            color: white;
            padding: 5px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
        `;
        arrow.appendChild(label);

        return arrow;
    }

    clearArrows(): void {
        if (this.overlay) {
            this.overlay.innerHTML = '';
        }
    }

    removeOverlay(): void {
        if (this.overlay) {
            document.body.removeChild(this.overlay);
            this.overlay = null;
        }
    }
}