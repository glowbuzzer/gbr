import { useEffect, useState } from "react"

function getBrowserVisibilityProp() {
    if (typeof document.hidden !== "undefined") {
        return "visibilitychange"
    } else if (typeof (document as any).msHidden !== "undefined") {
        return "msvisibilitychange"
    } else if (typeof (document as any).webkitHidden !== "undefined") {
        return "webkitvisibilitychange"
    }
}

function getBrowserDocumentHiddenProp() {
    if (typeof document.hidden !== "undefined") {
        return "hidden"
    } else if (typeof (document as any).msHidden !== "undefined") {
        return "msHidden"
    } else if (typeof (document as any).webkitHidden !== "undefined") {
        return "webkitHidden"
    }
}

function getIsDocumentHidden() {
    return !document[getBrowserDocumentHiddenProp()]
}

export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(getIsDocumentHidden())
    const onVisibilityChange = () => setIsVisible(getIsDocumentHidden())
    useEffect(() => {
        const visibilityChange = getBrowserVisibilityProp()
        document.addEventListener(visibilityChange, onVisibilityChange, false)
        return () => {
            document.removeEventListener(visibilityChange, onVisibilityChange)
        }
    })
    return isVisible
}
