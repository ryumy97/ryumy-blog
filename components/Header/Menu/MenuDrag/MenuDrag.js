import React, {useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { useMouseContext, faHandRock } from '../../../../context/MouseTracker';
import ColorBox from '../../../ColorBox'

import styles from './MenuDrag.module.css'


export default function MenuDrag({openMenu, isOpen, isTop, dropDownRef}) {
    const { position } = useMouseContext();
    const [pressed, setPressed] = useState(false);
    const [moved, setMoved] = useState(false);
    const [currentPosition, setCurrnetPosition] = useState({x: 0, y: 0});
    const [movedPosition, setMovedPosition] = useState({x: 0, y: 0});
    const [clickEventOn, setClickEventOn] = useState(false);
    
    const draggerRef = useRef();

    useEffect(() => {
        draggerRef.current ? draggerRef.current.style.transform = `translate(${movedPosition.x}px, ${movedPosition.y}px)` : null;
        dropDownRef.current &&
            !isOpen ? dropDownRef.current.style.transform = `translateY(${movedPosition.y/3}px)` : dropDownRef.current.style.transform = `translateY(0px)`;
    }, [position])

    useEffect(() => {
        if (pressed) {
            setMovedPosition({
                x: position.x - currentPosition.x,
                y: position.y - currentPosition.y
            })
            
            if (movedPosition.y > 75) {
                openMenu();
                setPressed(false)
                setMovedPosition({x: 0, y: 0})
            }

            if (movedPosition.x > 100 || movedPosition.x < -100) {
                setPressed(false)
                setMovedPosition({x: 0, y: 0})
            }
        }
        
    }, [position])

    return (
        <div 
            ref= { draggerRef }
            className={`${styles.menuDrag} ${isOpen ? styles.open : ''} ${isTop ? styles.top : ''} ${pressed ? styles.dragging : ''} ${clickEventOn ? styles.clickMenu : ''}`}
            onMouseDown={() => {
                if (clickEventOn) {
                    return
                }
                setPressed(true)
                setCurrnetPosition({
                    x: position.x,
                    y: position.y
                })
            }}
            onMouseUp={() => {
                if (clickEventOn) {
                    return
                }

                setPressed(false)
                setMovedPosition({x: 0, y: 0})

                if (!moved) {
                    console.log('clicked');

                    setClickEventOn(true);
                }
                setMoved(false);
            }}
            onMouseMove={() => {
                if (clickEventOn) {
                    return
                }
                
                if (pressed) {
                    setMoved(true);
                }
            }}
        >
            <div className={`${styles.tail}`}>            
                <ColorBox color="#311B92"></ColorBox>
            </div>
            <ColorBox color="#512DA8"></ColorBox>
            <ColorBox color="#673AB7"></ColorBox>
            <ColorBox color="#7E57C2" className={styles.lastItem}></ColorBox>
            <div className={styles.menuContainer}>
                <FontAwesomeIcon icon={faBars} className={styles.hamburger}/>                
            </div>
            
            {
                clickEventOn
                    ? <div
                        className={styles.clickPointer}
                        onAnimationEnd={() => {setClickEventOn(false)}}
                        aria-hidden="true"
                    ></div>
                    : null
            }
        </div>
    )
}

