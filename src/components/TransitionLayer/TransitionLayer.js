import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import { useTheme } from 'context/ThemeProvider';
import { useMenuContext } from 'context/MenuProvider';

import { openingMotion, closingMotion } from './motions';

import styles from './TransitionLayer.module.css'
import Canvas from '../Canvas/Canvas';

export default function TransitionLayer() {
    const { setTheme, getNextTheme } = useTheme();
    const { pathname } = useLocation();
    const { closeMenu, isOpen } = useMenuContext();

    const [nextTheme, setNextTheme] = useState(getNextTheme());
    const [opening, setOpening] = useState(false);
    const [closed, setClosed] = useState(false);
    const [prevPath, setPrevPath] = useState(pathname);

    useEffect(() => {
        setPrevPath(pathname);
    }, [pathname])

    useEffect(() => {
        if (isOpen) {
            if (prevPath !== pathname) {
                setOpening(true);
                setClosed(false);
                setNextTheme(getNextTheme());
            }
        }
    }, [isOpen, prevPath, pathname, getNextTheme])

    let wave = null;

    const draw = (ctx, frameCount, { resetFrameCount }) => {
        if (closed) {
            resetFrameCount();
            return
        }
        if (opening) {
            const progress = frameCount / 60;
            wave = openingMotion(ctx, progress < 1 ? progress : 1, nextTheme, wave);
            if (progress > 2) {
                setOpening(false);
                closeMenu();
                setTheme(nextTheme.key);
            }
        }
        else {
            const progress = frameCount/30 - 0.25;
            closingMotion(ctx, progress < 1 ? progress : 1, nextTheme);
            if (progress > 1) {
                setClosed(true)
                resetFrameCount();
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