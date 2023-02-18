import { initOffscreenCanvasSize } from '../../lib/canvas'
import { showP3, showRec2020 } from '../../stores/settings'
import { support } from '../../stores/support'
import { paintCH, paintCL, paintLH } from './paint'

interface SharedProps {
  scale: number
  hasP3: boolean
  isShowP3: boolean
  isShowRec2020: boolean
}

export type MessageData =
  | {
      type: 'init'
      canvas: HTMLCanvasElement
      width: number
      height: number
      p3Border: string
      rec2020Border: string
    }
  | ({
      type: 'l'
      l: number
    } & SharedProps)
  | ({
      type: 'c'
      c: number
    } & SharedProps)
  | ({
      type: 'h'
      h: number
    } & SharedProps)

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
    if (e.data.isShowP3 !== showP3.get()) {
      showP3.set(e.data.isShowP3)
    }
    if (e.data.isShowRec2020 !== showRec2020.get()) {
      showRec2020.set(e.data.isShowRec2020)
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
      ms: Date.now() - start,
      isFull: e.data.scale === 1
    })
  }
}
