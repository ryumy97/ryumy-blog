import BezierEasing from 'bezier-easing';

class Wave {
    constructor(
        stageWidth, 
        stageHeight
    ) {
        this.length = (stageWidth - stageWidth % 100) / 100;
        this.maxAmplitude = 15;
        this.currentHeight = 0;

        this.createWavePoints(stageWidth, stageHeight);
    }

    createWavePoints(stageWidth, stageHeight) {
        this.wavePoints = [];
        
        this.wavePoints.push(new WavePoint(0, stageHeight - this.currentHeight - this.maxAmplitude, 0, 0))
    
        for (let i = 1; i < this.length; i++) {
            const x = stageWidth / this.length * i;
            const y = stageHeight - this.currentHeight - this.maxAmplitude;
    
            const currentPoint = new WavePoint(x, y, this.maxAmplitude, Math.PI / 2 * i + Math.PI/4 * Math.random())
            
            this.wavePoints.push(currentPoint);
        }
    
        this.wavePoints.push(new WavePoint(stageWidth, stageHeight - this.currentHeight  - this.maxAmplitude, 0, 0));
    }

    update(currentHeight) {
        this.currentHeight = currentHeight;
        this.wavePoints.forEach((point) => {
            point.update(currentHeight - this.maxAmplitude)
        })
    }

    draw(ctx, { stageWidth, stageHeight }) {
        ctx.beginPath();
    
        ctx.moveTo(this.wavePoints[0].x, this.wavePoints[0].y);
    
        let prevPoint;
        
        this.wavePoints.forEach((value, index) => { 
            if (index === 0) {
                prevPoint = value;
                return;
            }
    
            const cx = (prevPoint.x + value.x) / 2;
            const cy = (prevPoint.y + value.y) / 2;
    
            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cx, cy);
    
            prevPoint = value;
        })
    
        ctx.lineTo(stageWidth, this.currentHeight - this.maxAmplitude);
        
        ctx.lineTo(stageWidth, stageHeight);
        
        ctx.lineTo(this.wavePoints[0].x, stageHeight);
        ctx.fill();
        ctx.closePath();
    }
}

class WavePoint {
    constructor(x, y, maxHAmplitude, angle) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.speed = 0.1;
        this.maxHAmplitude = maxHAmplitude;
        this.angle = angle;
    }

    update(fixedY) {
        this.angle += this.speed;
        this.fixedY = fixedY;
        this.y = this.fixedY + Math.sin(this.angle) * this.maxHAmplitude;
    }
}

export function openingMotion(ctx, progress, theme, wave) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const easing = BezierEasing(.44,1.29,.67,.04);
    const easingValue = easing(progress);

    const currentHeight = easingValue * height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = theme.primary;
    
    if (!wave) {
        wave = new Wave(width, height);
    }
    
    console.log(wave)
    
    wave.update(height - currentHeight);
    wave.draw(ctx, { stageWidth: width, stageHeight: height });

    return wave;
}
