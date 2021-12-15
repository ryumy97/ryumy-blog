import React, { useState } from 'react'

import { useTheme } from 'context/ThemeProvider';

import { openingMotion, resetOpening, closingMotion } from './motions';

import styles from './TransitionLayer.module.css'
import Canvas from '../Canvas/Canvas';

export default function TransitionLayer() {
    const { setTheme, currentTheme, getRandomTheme } = useTheme();
    const [opening, setOpening] = useState(true);
    const [closed, setClosed] = useState(false);

    let wave = null;

    const draw = (ctx, frameCount, { resetFrameCount }) => {
        if (closed) {
            return
        }
        if (opening) {             
            const progress = frameCount/60;
            wave = openingMotion(ctx, progress < 1 ? progress : 1, currentTheme, wave);
            if (progress > 2) {
                setOpening(false);
            }
        }
        else {
            const progress = frameCount/30 - 1;
            closingMotion(ctx, progress < 1 ? progress : 1, currentTheme);
            if (progress > 1) {
                setClosed(true)
            }
        }
    }

    const resizeCanvas = () => {
        if (closed) {
            return
        }
        if (opening) {
            wave = null;
        }
    }

    return(<Canvas draw={draw} resizeCanvas={resizeCanvas} className={`${styles.transitionLayer} ${closed ? styles.closed : ''}`} />)
}