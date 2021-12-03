
export function toSearchParam(data) {
    const searches = Object.entries(data).map((_) => {
        return `${_[0]}=${encodeURI(_[1])}`
    }).join('&');
    
    return `?${searches}`
}