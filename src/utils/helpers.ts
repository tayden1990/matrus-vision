export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: Parameters<T>) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

export const formatCoordinate = (x: number, y: number): string => {
    return `(${x}, ${y})`;
};

export const isValidCoordinate = (coord: any): boolean => {
    return coord && typeof coord.x === 'number' && typeof coord.y === 'number';
};