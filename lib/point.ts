
type IPoint2D = {
    x: Number
    y: Number
}

/**
 * 
 * @param p IPoint2D the point to be cloned.
 */
function clone(p: IPoint2D): IPoint2D {
    return { x: p.x, y: p.y }
}

export {
    clone,
    IPoint2D
}