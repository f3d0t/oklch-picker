import { initOffscreenCanvasSize } from '../../lib/canvas'
import { support } from '../../stores/support'
import { paintCH, paintCL, paintLH } from './paint'

export type MessageData =
  | {
      type: 'init'
      canvas: HTMLCanvasElement
      width: number
      height: number
      p3Border: string
      rec2020Border: string
    }
  | {
      type: 'l'
      l: number
      scale: number
      hasP3: boolean
    }
  | {
      type: 'c'
      c: number
      scale: number
      hasP3: boolean
    }
  | {
      type: 'h'
      h: number
      scale: number
      hasP3: boolean
    }

let canvas: HTMLCanvasElement | undefined
let p3Border: string
let rec2020Border: string

onmessage = (e: MessageEvent<MessageData>) => {
  if (e.data.type === 'init') {
    canvas = e.data.canvas
    initOffscreenCanvasSize(canvas, e.data.width, e.data.height)
    p3Border = e.data.p3Border
    rec2020Border = e.data.rec2020Border
  } else if (canvas) {
    if (e.data.hasP3 !== support.get().p3) {
      support.setKey('p3', e.data.hasP3)
    }
    let start = Date.now()
    if (e.data.type === 'l') {
      paintCH(canvas, e.data.l, e.data.scale, p3Border, rec2020Border)
    } else if (e.data.type === 'c') {
      paintLH(canvas, e.data.c, e.data.scale, p3Border, rec2020Border)
    } else {
      paintCL(canvas, e.data.h, e.data.scale, p3Border, rec2020Border)
    }
    postMessage({
      type: e.data.type,
      ms: Date.now() - start,
      isFull: e.data.scale === 1
    })
  }
}
