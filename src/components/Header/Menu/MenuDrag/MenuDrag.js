import React, {useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { useMouseContext } from '../../../../context/MouseTracker';
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
        if (draggerRef.current) {
            if (isOpen) {
                draggerRef.current.style.transform = `translateY(-100%)`   
            }
            else {
                draggerRef.current.style.transform = `translate(${movedPosition.x}px, ${movedPosition.y}px)`   
            }
            
        }
    }, [isOpen, movedPosition.x, movedPosition.y])

    useEffect(() => {
        if (dropDownRef.current) {
            !isOpen ? dropDownRef.current.style.top = `${movedPosition.y/3}px` : dropDownRef.current.style.top = `0`;
        }
    }, [dropDownRef, isOpen, movedPosition.y])

    useEffect(() => {
        if (pressed) {
            setMovedPosition({
                x: position.x - currentPosition.x,
                y: position.y - currentPosition.y
            })
        }
        
    }, [position, currentPosition.x, currentPosition.y, pressed])

    useEffect(() => {
        if (pressed) {
            if (movedPosition.y > 36) {
                openMenu();
                setPressed(false)
                setMovedPosition({x: 0, y: 0})
            }
        }
    }, [pressed, movedPosition.y, openMenu])
    
    useEffect(() => {
        if (pressed) {
            if (movedPosition.x > 100 || movedPosition.x < -100) {
                setPressed(false)
                setMovedPosition({x: 0, y: 0})
            }
        }
    }, [pressed, movedPosition.x])

    const onMouseDown = () => {
        if (clickEventOn) {
            return
        }
        setPressed(true)
        setCurrnetPosition({
            x: position.x,
            y: position.y
        })
    }

    const onMouseUp = () => {
        if (clickEventOn) {
            return
        }

        setPressed(false)
        setMovedPosition({x: 0, y: 0})

        if (!moved) {
            setClickEventOn(true);
        }
        setMoved(false);
    }

    const onMouseMove = () => {
        if (clickEventOn) {
            return
        }
        
        if (pressed) {
            setMoved(true);
        }
    }

    return (
        <div 
            ref= { draggerRef }
            className={`${styles.menuDrag} ${isOpen ? styles.open : ''} ${isTop ? styles.top : ''} ${pressed ? styles.dragging : ''} ${clickEventOn ? styles.clickMenu : ''}`}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        >
            <div className={`${styles.tail}`}>            
                <ColorBox color="#311B92"></ColorBox>
            </div>
            <ColorBox color="#512DA8"></ColorBox>
            <ColorBox color="#673AB7"></ColorBox>
            <ColorBox color="#7E57C2" className={styles.lastItem}></ColorBox>
            <div className={styles.menuContainer}>
                <div className={styles.burgerContainer}>
                    <FontAwesomeIcon icon={faBars} className={styles.burger}/>   
                </div>             
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

