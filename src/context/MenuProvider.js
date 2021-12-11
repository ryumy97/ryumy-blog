import React, { useContext, useEffect, useState, createContext } from "react";

const MenuContext = createContext()

export default function MenuProvider({children}) {
    const [isTop, setIsTop] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    
    const openMenu = () => {
        if (isTop) {
            setIsOpen(prev => !prev);
        }
        else {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    const closeMenu = () => {
        setIsOpen(false);
    }
    
    useEffect(() => {
        if (!isTop) {
            setIsOpen(false)
        }
    }, [isTop])

    document.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            setIsTop(false)
        }
        else if(window.scrollY < 200) {
            setIsTop(true)
        }
    })
    

    return (
        <MenuContext.Provider
            value={{
                isTop,
                isOpen,
                openMenu,
                closeMenu
            }}
        >
            {children}
        </MenuContext.Provider>
    )
}

export function useMenuContext() {
    const menuContext = useContext(MenuContext);

    if (!menuContext) {
        throw Error("Need to wrap with Menu Provider");
    }

    return menuContext;
}
