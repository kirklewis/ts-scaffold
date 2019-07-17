/** sumAll
 * Returns the sum of all the `numbers` supplied.
 *
 * @param numbers an array of numbers to add together
 * @returns the sum of all the numbers
 */
function sumAll(...numbers: number[]): number {
    return numbers.reduce((p, c) => p + c)
}

export { sumAll }