import { useContext, useState, createContext } from "react";

const MouseContext = createContext()

export default function MouseProvider({children}) {
    const [position, setPosition] = useState({x: 0, y: 0})

    const mouseMove = (event) => {
        setPosition({
            x: event.clientX,
            y: event.clientY 
        })
    }
    return (
        <MouseContext.Provider
            value={{
                position
            }}
        >
            <div
                onMouseMove={ mouseMove }
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
