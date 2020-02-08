
export interface IPoint2D {
    readonly x: number
    readonly y: number
}

export const addPoint = function (p1: IPoint2D, p2: IPoint2D): IPoint2D {
    return {
        x: p1.x + p2.x,
        y: p1.y + p2.y
    }
}

export const clonePoint = function (point: IPoint2D): IPoint2D {
    return { x: point.x, y: point.x }
}

export const isPointEqual = function (p1: IPoint2D, p2: IPoint2D): boolean {
    return p1.x == p2.x && p1.y == p2.y
}

export const isPointZero = function (point: IPoint2D): boolean {
    return point.x == 0 && point.y == 0
}

export const subtractPoint = function (p1: IPoint2D, p2: IPoint2D): IPoint2D {
    return {
        x: p1.x - p2.x,
        y: p1.y - p2.y
    }
}

export const subtractFromPoint = function (point: IPoint2D, amount: number): IPoint2D {
    return {
        x: point.x - amount,
        y: point.y - amount
    }
}

// This implementation is fastest according to JSBench
// faster than ternary which is 3.89% slower in Safari
export const reversePoint = function (p: IPoint2D, temp: string = null) {
    
    let o = { x: 0, y: 0 }
    // if (temp)  console.log('BEFORE ---->', temp); _(p); _(o);

    if (p.x !== 0) { o.x = p.x * -1 }
    if (p.y !== 0) { o.y = p.y * -1 }
    // if (temp)  console.log('AFTER ---->', temp); _(p); _(o);

    return o
}

// This implementation is fastest in Chrome and Safari.
// conditional alternative is 3.68% slower in Chrome.
export const normalisePoint = function (p: IPoint2D): IPoint2D {
    return {
        x: p.x > 0 ? 1 : p.x < 0 ? -1 : 0,
        y: p.y > 0 ? 1 : p.y < 0 ? -1 : 0,
    }
}

/** MoveDirection represents the vector which a position can
 * use to calculate a new position based on L, R, U, D movement.
 * 
 * @example
 * ```js
 * let position = { x: 2, y: 2 }
 * let newPosition = {
 *      x: position.x + MoveDirection.UP.x * moveSpeed,
 *      y: position.y + MoveDirection.UP.y * moveSpeed,
 * }
 * ```
 * 
 */


export const NONE : IPoint2D = { x: 0, y: 0 }
export const UP   : IPoint2D = { x: 0, y: -1 }
export const DOWN : IPoint2D = { x: 0, y: 1 }
export const LEFT : IPoint2D = { x: -1, y: 0 }
export const RIGHT: IPoint2D = { x: 1, y: 0 }

export const MoveDirection = { NONE, UP, DOWN, LEFT, RIGHT }

// type MoveDir = 

// addPoint but more specific to the game mechanics
export const moveToGridPoint = function (point: IPoint2D, direction: IPoint2D, cellSize: number = 10) {
    return addPoint(point, {
        x: direction.x * cellSize,
        y: direction.y * cellSize
    })
}

interface IBodyPart {
    direction?: IPoint2D
    previous?: IBodyPart
    position?: IPoint2D

    setPositionToPrevious(): void
}

export class BodyPart implements IBodyPart {
    public name: String
    
    private _direction: IPoint2D
    private _position: IPoint2D
    private _previous: IBodyPart

    constructor(config: SnakeConfig = {}) {
        this._position = config.position
        this._previous = config.previous
        this._direction = config.direction
    }
    
    get direction(): IPoint2D {
        return this._direction
    }

    set direction(value: IPoint2D) {
        this._direction = value
    }

    get position(): IPoint2D {
        return this._position
    }

    set position(value: IPoint2D) {
        this._position = value
    }

    get previous(): IBodyPart {
        return this._previous
    }

    set previous(value: IBodyPart) {
        this._previous = value
    }

    // updated the current part with the direction and position of its previous part
    // TODO: this needs renaming... or concern separating.
    setPositionToPrevious() {
        // we subtract previous from last then normalise, because for a fact
        // only either of x or y will change, which means the subtraction will
        // leave one of the components being 0.
        // Example: pos = (20, 20), newPos = (30, 20) 
        // subtract (-10, 0) normalise(-10, 0) - (-1, 0) = LEFT
        // TEST CASE ^^^^^ - this will always be one of either U, D, L, R
        this.direction = normalisePoint(subtractPoint(this.previous.position, this.position))
        this.position = this.previous.position
    }
}

interface SnakeConfig {
    position?: IPoint2D
    direction?: IPoint2D
    previous?: IBodyPart
    tailSize?: number
}

// POC
export class Snake {
    head: IBodyPart
    tail: IBodyPart
    parts: IBodyPart[] = []

    private _direction: IPoint2D = {x:0, y:0}
    private _position: IPoint2D = {x:0, y:0}

    // build snake with at least a head
    constructor({ position, direction = MoveDirection.LEFT }) {
        this._direction = direction
        this._position = position

        this.head = new BodyPart({ position, direction })
        this.tail = null
        this.parts = [ this.head ] // our snake will always have a tail
       
        // FIXME: what if we want to add 4 tail parts...
        this.addTail(this.calculateNewTailPosition())
        this.addTail(this.calculateNewTailPosition())
    }

    set direction(value: IPoint2D) {
        this._direction = value
        this.head.direction = value
    }

    get direction(): IPoint2D {
        return this._direction
    }

    public set position(value: IPoint2D) {
        this._position = value
        this.head.position = this.position
    }

    public get position(): IPoint2D {
        return this._position
    }

    /**
     * Calculates the position for a new tail so that it is placed
     * TODO: this may need to be an external function in the future
     * because if the position of the new tail is out of bounds
     * then it must be relocated to a more suitable position.
     * To know this however, snake must be aware of the size of the Grid
     * which VIOLATES Separation of Concern.
     */
    calculateNewTailPosition() {
        if (this.parts.length == 1) {
            let p = moveToGridPoint(this._position, reversePoint(this._direction))
            return p
        } else {
            let p = moveToGridPoint(this.tail.position, reversePoint(this.tail.direction))
            return p
        }
    }

    addTail(position: IPoint2D) {
        const numParts = this.parts.length
        const newBodyPart = new BodyPart({ position })

        // would could have easily have said this.tail here
        // but I want to assign previous in a consistent manner
        newBodyPart.previous = this.parts[numParts - 1]
        newBodyPart.direction = newBodyPart.previous.direction

        this.tail = newBodyPart
        this.parts.push(newBodyPart)
    }

    // rename addTail
    addPart(part: BodyPart) {
        this.parts.push(part)

        // set the previous on parts other than the head
        if (this.parts.length > 1) {
            part.previous = this.parts[this.parts.indexOf(part) - 1]
            this.tail = part
        } else {
            this.head = part
        }

        // we will probably need some refactoring for adding a part.
        // so far we have created a part with its position already set
        // then added it to the snake.... hmmm. Whilt this works fine,
        // it means that the snake positin must be pre-determined.
        // instead, what should (not must) happen 'idealy' is this:
        // snake eats food or other
        // addPart is called but it adds the part based on the direction
        // that the previous part is travelling in...
        // PROBLEMS: 
        //  - add part may become to complex i.e. handles multiple concerns???
        //  - direction is currently stored in the head only, so how would 
        //    the new part know whether is is to the east, west, north, or south
        //    of the previous part????

    }

    // newPosition comsed from adding direction to current position
    // which is just the heads position.
    // TODO: update should not know about new position,
    // it should calculate it based on direction and position.
    update() {
        const partsCount = this.parts.length - 1

        // Update both position and direction of the each part.
        for (let i = partsCount; i >= 1; i--) {
            const part = this.parts[i]
            // ???: what direction is current part traveling in
            part.setPositionToPrevious()
        }

        // move head to a new position based on direction
        // FIXME: setting position should update head position automatically
        // use a setter getter and change interface...
        this.head.position = moveToGridPoint(this.position, this.direction)
        this.position = this.head.position

        // After this is done external functions just need to
        // redraw the parts i.e. 'drawSnake'
    }
}

function _(p: object) {
    return console.log(JSON.stringify(p, null, 4))
}