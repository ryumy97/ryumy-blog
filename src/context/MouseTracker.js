import { useContext, useState, createContext } from "react";

const MouseContext = createContext()

export default function MouseProvider({children}) {
    const [position, setPosition] = useState({x: 0, y: 0})
    const [click, setMouseClick] = useState(false);

    const mouseMove = (event) => {
        setPosition({
            x: event.clientX,
            y: event.clientY 
        })
    }

    const mouseUp = (event) => {
        setMouseClick(false);
        
    }

    const mouseDown = (event) => {
        setMouseClick(true)
    }

    return (
        <MouseContext.Provider
            value={{
                position,
                click
            }}
        >
            <div
                onMouseMove={ mouseMove }
                onMouseUp={ mouseUp }
                onMouseDown={ mouseDown }
            >
                {children}
            </div>
        </MouseContext.Provider>
    )
}

export function useMouseContext() {
    const mouseContext = useContext(MouseContext);

    if (!mouseContext) {
        throw Error("Need to wrap with Post Provider");
    }

    return mouseContext;
}
