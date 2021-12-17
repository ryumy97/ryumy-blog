import BezierEasing from 'bezier-easing';

export function closingMotion(ctx, progress, theme) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    if (progress < 0) {
        ctx.fillStyle = theme.primary;
        ctx.fillRect(0, 0, width, height);
        return;
    }
    const easing = BezierEasing(.82,.24,.13,.92);
    const value = easing(progress);
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = theme.primary;
    ctx.fillRect(0, 0, width, height - height * value);
}