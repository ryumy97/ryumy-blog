import React, { useEffect, useRef } from 'react';

export default function Canvas({draw, resetFrameCount, resizeCanvas, ...rest}) {
    const ref = useRef();

    useEffect(() => {
        const canvas = ref.current
        const ctx = canvas.getContext('2d');

        let frameCount = 0;
        let animationFrameId;

        const resetFrameCount = () => {
            frameCount = 0;
        }

        const render = () => {
            frameCount++;

            resizeCanvasEvent(canvas, resizeCanvas);
            draw(ctx, frameCount, { resetFrameCount });

            animationFrameId = window.requestAnimationFrame(render);
        }
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }

    }, [draw, resizeCanvas])

    return(<canvas {...rest} ref={ref}/>)
}

function resizeCanvasEvent(canvas, resizeCanvas) {
    const { width, height } = canvas.getBoundingClientRect()
    
    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio:ratio=1 } = window
      const context = canvas.getContext('2d')
      canvas.width = width*ratio
      canvas.height = height*ratio
      context.scale(ratio, ratio)

      resizeCanvas();
      
      return true
    }

    return false
}