import { expect } from 'chai'
import {
    addPoint,
    clonePoint,
    isPointEqual,
    MoveDirection,
    moveToGridPoint } from '../index'
import { Snake, BodyPart, subtractPoint, normalisePoint, IPoint2D, subtractFromPoint, reversePoint } from '../lib/snake';


describe('Point2D', () => {
    it('addPoint', () => {
        const pointA = { x: 2, y: 2 }
        const pointB = { x: 2, y: 0 }

        expect(addPoint(pointA, pointB)).to.deep.equal({x: 4, y: 2 })
        expect(addPoint(pointA, { x: -2, y: -2 })).to.deep.equal({x: 0, y: 0 })
    })

    it('clonePoint', () => {
        const point = { x: 2, y: 2 }

        expect(clonePoint(point)).to.deep.equal({ x: 2, y: 2 })
        expect(clonePoint(point)).to.not.equal(point)
    })

    it('normalisePoint', () => {
        expect(normalisePoint({ x: 10, y: 10 })).to.deep.equal({ x: 1, y: 1 }, 'A')
        expect(normalisePoint({ x: -10, y: -10 })).to.deep.equal({ x: -1, y: -1 }, 'B')
        expect(normalisePoint({ x: 0, y: 0 })).to.deep.equal({ x: 0, y: 0 }, 'C')
        expect(normalisePoint({ x: -10, y: 10 })).to.deep.equal({ x: -1, y: 1 }, 'D')
    })    

    it('isPointEqual', () => {
        const pointA = { x: 2, y: 2 }
        const pointB = { x: 2, y: 0 }
        
        expect(isPointEqual(pointA, pointB)).to.be.false;
        expect(isPointEqual(pointA, pointA)).to.be.true;
    })

    it('reversePoint', () => {
        expect(reversePoint(MoveDirection.LEFT)).to.deep.equal(MoveDirection.RIGHT)
        expect(reversePoint(MoveDirection.RIGHT)).to.deep.equal(MoveDirection.LEFT)
        expect(reversePoint(MoveDirection.UP)).to.deep.equal(MoveDirection.DOWN)
        expect(reversePoint(MoveDirection.DOWN)).to.deep.equal(MoveDirection.UP)
    })

    it('subtractPoint', () => {
        const pointA = { x: 10, y: 20 }
        const pointB = { x: 20, y: 20 }

        expect(subtractPoint(pointA, pointB)).to.deep.equal({ x: -10, y: 0 })
    })  
})

describe('MoveDirection', () => {
    it('should have new postion after adding direction', () => {
        const position = { x: 2, y: 2 }

        expect(addPoint(position, MoveDirection.LEFT)).to.deep.equal({ x: 1, y: 2 })
        expect(addPoint(position, MoveDirection.RIGHT)).to.deep.equal({ x: 3, y: 2 })
        expect(addPoint(position, MoveDirection.UP)).to.deep.equal({ x: 2, y: 1 })
        expect(addPoint(position, MoveDirection.DOWN)).to.deep.equal({ x: 2, y: 3 })
        expect(addPoint(position, MoveDirection.NONE)).to.deep.equal(position)
    })
})

describe('moveToGridPoint', () => {
    const position = { x: 20, y: 20 }

    it('should stay in same place on the grid', () => {
        expect(moveToGridPoint(position, MoveDirection.NONE)).to.deep.equal({ x: 20, y: 20 })
        expect(moveToGridPoint(position, MoveDirection.NONE, 5)).to.deep.equal({ x: 20, y: 20 })
    })

    it('should move position to the right on the grid', () => {
        expect(moveToGridPoint(position, MoveDirection.RIGHT)).to.deep.equal({ x: 30, y: 20 })
        expect(moveToGridPoint(position, MoveDirection.RIGHT, 5)).to.deep.equal({ x: 25, y: 20 })
    })

    it('should move position to the left on the grid', () => {
        expect(moveToGridPoint(position, MoveDirection.LEFT)).to.deep.equal({ x: 10, y: 20 })
        expect(moveToGridPoint(position, MoveDirection.LEFT, 5)).to.deep.equal({ x: 15, y: 20 })
    })

    it('should move position to the up on the grid', () => {
        expect(moveToGridPoint(position, MoveDirection.UP)).to.deep.equal({ x: 20, y: 10 })
        expect(moveToGridPoint(position, MoveDirection.UP, 5)).to.deep.equal({ x: 20, y: 15 })
    })

    it('should move position to the down on the grid', () => {
        expect(moveToGridPoint(position, MoveDirection.DOWN)).to.deep.equal({ x: 20, y: 30 })
        expect(moveToGridPoint(position, MoveDirection.DOWN, 5)).to.deep.equal({ x: 20, y: 25 })
    })

    // XXX: remember our game should check whether the new position
    // is out of bounds and if it is throw an OutOfGridBounds error.
    // example: handle it by either wrapping the current position around stage
    // or killing the position, exploding snake head something... :) HA HA HA
    
})

// remove this test later we will have QA for this.
describe('moveToGridPoint - in a circle', () => {
    it('should move position left, down, right and up', () => {
        const position = { x: 20, y: 20 }
        let newPosition = moveToGridPoint(position, MoveDirection.LEFT)
        newPosition = moveToGridPoint(newPosition, MoveDirection.DOWN)
        newPosition = moveToGridPoint(newPosition, MoveDirection.RIGHT)
        newPosition = moveToGridPoint(newPosition, MoveDirection.UP)

        expect(newPosition).to.deep.equal(position)

        // POC: positioning a new tail - we are travelling to the right.
        const expectedTailPosition = { x: 10, y: 20 }
        const tailPosition = moveToGridPoint(position, reversePoint(MoveDirection.RIGHT))

        expect(tailPosition).to.deep.equal(expectedTailPosition)
    })

    it('should construct snake correctly', () => {
        const position = { x: 20, y: 20 }
        console.log('MoveDirection.LEFT = ', MoveDirection.LEFT)
        const snake = new Snake({ position, direction: MoveDirection.LEFT })

        // console.log('initial position - ', _(snake.position), 'inital direction', _(snake.direction))

        expect(snake.parts.length).to.equal(3, 'should have 3 body parts')
        expect(snake.head).to.not.equal(null, 'head not null')
        expect(snake.tail).to.not.equal(null, 'tail not null')
        expect(snake.parts[0]).to.deep.equal(snake.head, 'current element ')
        expect(snake.parts[2]).to.deep.equal(snake.tail, 'current element ')

        expect(snake.head.position).to.deep.equal(position, 'correct position')
        expect(snake.tail.position).to.deep.equal({ x: 40, y: 20 }, 'to the right of the head')
    })

    it('should MOVE temp test', () => {
        const position = { x: 20, y: 20 }
        const snake = new Snake({ position })

        snake.direction = MoveDirection.LEFT
        snake.update()

        expect(snake.position).to.deep.equal({ x: 10, y: 20 })
        expect(snake.tail.position).to.deep.equal({ x: 30, y: 20 })
        expect(snake.tail.direction).to.deep.equal(MoveDirection.LEFT)

        snake.direction = MoveDirection.DOWN
        snake.update()
        expect(snake.position).to.deep.equal({ x: 10, y: 30 })
        expect(snake.tail.position).to.deep.equal({ x: 20, y: 20 })
        expect(snake.tail.direction).to.deep.equal(MoveDirection.LEFT)

        snake.update()
        expect(snake.position).to.deep.equal({ x: 10, y: 40 })
        expect(snake.tail.position).to.deep.equal({ x: 10, y: 20 })
        expect(snake.tail.direction).to.deep.equal(MoveDirection.LEFT)

        snake.update()
        expect(snake.position).to.deep.equal({ x: 10, y: 50 })
        expect(snake.tail.position).to.deep.equal({ x: 10, y: 30 })
        expect(snake.tail.direction).to.deep.equal(MoveDirection.DOWN)

        console.log('HEAD: ', _(snake.head.position), _(snake.head.direction))
        console.log('TAIL: ', _(snake.tail.position), _(snake.tail.direction))
    })


})


function _(p: object, pretty = false) {
    return JSON.stringify(p, null, pretty ? 4 : 0)
}


// describe('Snake - addPart', () => {
//     const snake = new Snake()
//     const part1 = new BodyPart({x: 20, y: 20})
//     const part2 = new BodyPart({x: 30, y: 20})
//     const part3 = new BodyPart({x: 40, y: 20})

//     it('should have 0 parts initially', () => {
//         expect(snake.parts.length).to.equal(0)
//         expect(snake.head).to.equal(null)
//     })

//     it('should have correct number of parts after adding', () => {
//         snake.addPart(part1)
//         expect(snake.parts.length).to.equal(1)
//     })


//     it('head should be set correctly', () => {
//         expect(snake.head).to.not.equal(null)
//         expect(snake.head.previous).to.equal(null)
//         expect(snake.tail).to.equal(null)
//     })

//     it('head and tail should be set correctly', () => {
//         snake.addPart(part2)
//         expect(snake.tail).to.not.equal(null)
//         expect(snake.tail.previous).to.equal(snake.head)
//         expect(snake.parts[0]).to.equal(snake.head)
//         expect(snake.parts[1]).to.equal(snake.tail)

//         snake.addPart(part3)
//         expect(snake.tail).to.equal(part3)
//         expect(snake.tail.previous).to.equal(part2)
//     })

// })

// // POC Test ... when our snake moves
// describe('Snake - move', () => {
//     const snake = new Snake()
//     const head = new BodyPart({x: 20, y: 20})
//     head.name = 'head'
//     const tail1 = new BodyPart({x: 30, y: 20})
//     tail1.name = 'tail_1'
//     const tail2 = new BodyPart({x: 40, y: 20})
//     tail2.name = 'tail_2'

//     snake.addPart(head)
//     snake.addPart(tail1)
//     snake.addPart(tail2)

//     it('should move all parts based on direction', () => {
//         const newPosition = moveToGridPoint(head.position, MoveDirection.DOWN)

//         snake.update(newPosition)

//         const expectedPositions = [
//             { x: 20, y: 30 },
//             { x: 20, y: 20 },
//             { x: 30, y: 20 },
//         ]
//         expectedPositions.forEach((expected, i) => {
//             expect(snake.parts[i].position).to.deep.equal(expected)
//         })
//     })


//     it('should get correct tail direction from position', () => {
//         // expect(snake.calculate({x: -10}))

//         // this is not possible you cannot get tail position from direction
//         // unless you set direction on the tail itself.
//         // doing this leads to a problem:
//         // - redundancy of direction never being used once tail is passed to new part.
//         // INSTEAD:
//         // 1. we need get the tail's direction
//         // 2. use it to put the new tail in its correct position
//         // Example:
//         //      const newPosition = moveToGridPoint(head.position, MoveDirection.DOWN)
//         //

       
//     })
// })



// TODO: remove me
function printSnake(snake) {
    snake.parts.forEach( p => {
        let str = `>>> ${p.name} position is ${JSON.stringify(p.position)}`
        if (p.previous) {
            str += ` previous part is ${p.previous.name} - ${JSON.stringify(p.previous.position)}`
        }
        console.log(`${str}`)
    })
    console.log('-'.repeat(50))
}
