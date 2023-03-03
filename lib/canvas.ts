import { support } from '../stores/support.js'

export function getCleanCtx(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D {
  let ctx = canvas.getContext('2d', {
    colorSpace: support.get().p3 ? 'display-p3' : 'srgb'
  })!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  return ctx
}

let originSize = new Map<HTMLCanvasElement, [number, number]>()

export function initCanvasSize(
  canvas: HTMLCanvasElement,
  pixelRation: number = Math.ceil(window.devicePixelRatio),
  canvasSize: DOMRect = canvas.getBoundingClientRect(),
  sizeMap: Map<HTMLCanvasElement, [number, number]> = originSize
): [number, number] {
  let width = canvasSize.width * pixelRation
  let height = canvasSize.height * pixelRation
  canvas.width = width
  canvas.height = height
  sizeMap.set(canvas, [width, height])
  return [width, height]
}

export function setScale(
  canvas: HTMLCanvasElement,
  scale: number
): [number, number] {
  let [originWidth, originalHeight] = originSize.get(canvas)!
  let width = Math.floor(originWidth / scale)
  let height = Math.floor(originalHeight / scale)
  canvas.width = width
  canvas.height = height
  return [width, height]
}
