import * as Two from "two.js";
import { createCanvas } from "canvas";


const canvasWidth = 600
const canvasHeight = 600
const canvas = createCanvas(canvasWidth, canvasHeight);
const two = new Two({
    width: canvasWidth,
    height: canvasHeight,
    domElement: canvas
})

Two.Utils.shim(canvas)

// console.log(two)

two.render()