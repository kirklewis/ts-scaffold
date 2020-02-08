
export interface IPoint2D {
    x: number
    y: number
}

export const addPoint = function (p1: IPoint2D, p2: IPoint2D): IPoint2D {
    return {
        x: p1.x + p2.x,
        y: p1.y + p2.y
    }
}

export const clonePoint = function(point: IPoint2D): IPoint2D {
    return { x: point.x, y: point.x }
}

export const isPointEqual = function(p1: IPoint2D, p2: IPoint2D): boolean {
    return p1.x == p2.x && p1.y == p2.y
}

export const isPointZero = function(point: IPoint2D): boolean {
    return point.x == 0 && point.y == 0
}

export const subtractPoint = function(p1: IPoint2D, p2: IPoint2D): IPoint2D {
    return {
        x: p1.x - p2.x,
        y: p1.y - p2.y
    }
}

export const normalisePoint = function(p: IPoint2D): IPoint2D {
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
export const MoveDirection = {
    NONE  : { x:  0, y:  0 },
    UP    : { x:  0, y: -1 },
    DOWN  : { x:  0, y:  1 },
    LEFT  : { x: -1, y:  0 },
    RIGHT : { x:  1, y:  0 }
}

// type MoveDir = 

// addPoint but more specific to the game mechanics
export const moveToGridPoint = function(point: IPoint2D, direction: IPoint2D, cellSize: number = 10) {
    return addPoint(point, {
        x: direction.x * cellSize,
        y: direction.y * cellSize
    })
}

interface IBodyPart {
    previous: IBodyPart | null
    position: IPoint2D
}

export class BodyPart implements IBodyPart {
    public direction: IPoint2D
    public name: String
    public position: IPoint2D
    public previous: BodyPart

    constructor(position: IPoint2D, previous: BodyPart = null) {
        this.position = position
        this.previous = previous // if null then its head
    }

    setPositionToPrevious() {
        this.position = this.previous.position
    }
}

// POC
export class Snake {
    head: BodyPart
    tail: BodyPart
    parts: BodyPart[]

    constructor() {
        this.head = null
        this.tail = null
        this.parts = []
    }

    /**
     * Gets the direction of a part using its new position.
     * newPosition(10,20) - lastPos (20,20) = -10,0 (normalise) to -1,0
     * therefore x < 0, so direction is LEFT
     */
    getDirectionFromNewPosition(newPosition: IPoint2D): IPoint2D {

        return 
    }

    addPart(part: BodyPart) {
        this.parts.push(part)

        // set the previous on parts other than the head
        if (this.parts.length > 1) {
            part.previous = this.parts[ this.parts.indexOf(part) - 1 ]
            this.tail = part
            console.log(`>> set part ${part.name} previous part to ${part.previous.name}`)
        } else {
            console.log(`>> added head ${part.name} which has no previous part`)
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
    update(newPosition: IPoint2D) {
        const partsCount = this.parts.length - 1

        for (let i = partsCount; i >= 1; i--) {
            const part = this.parts[i]
            part.setPositionToPrevious()
        }

        this.head.position = newPosition

        // After this is done external functions just need to
        // redraw the parts i.e. 'drawSnake'
    }
}

// snake.addPart(head)
// snake.addPart(bodyPart1)
// snake.addPart(bodyPart2)
// console.log(snake)
