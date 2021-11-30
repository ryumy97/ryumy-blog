import React, {useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { useMouseContext } from '../../../../context/MouseTracker';
import ColorBox from '../../../ColorBox'

import styles from './MenuDrag.module.css'


export default function MenuDrag({openMenu, isOpen, isTop, dropDownRef}) {
    const { position } = useMouseContext();
    const [pressed, setPressed] = useState(false);
    const [currentPosition, setCurrnetPosition] = useState({x: 0, y: 0});
    const [movedPosition, setMovedPosition] = useState({x: 0, y: 0});
    
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
            className={`${styles.menuDrag} ${isOpen ? styles.open : ''} ${isTop ? styles.top : ''} ${pressed ? styles.dragging : ''}`}
            onMouseDown={() => {
                setPressed(true)
                setCurrnetPosition({
                    x: position.x,
                    y: position.y
                })
            }}
            onMouseUp={() => {
                setPressed(false)
                setMovedPosition({x: 0, y: 0})
            }}
        >
            <div className={`${styles.tail}`}>            
                <ColorBox color="#00BFA5"></ColorBox>
            </div>
            <ColorBox color="#00BFA5"></ColorBox>
            <ColorBox color="#00E676"></ColorBox>
            <ColorBox color="#7C4DFF" className={styles.lastItem}></ColorBox>
            <div className={styles.menuContainer}>
                <FontAwesomeIcon icon={faBars} className={styles.hamburger}/>                
            </div>
        </div>
    )
}

