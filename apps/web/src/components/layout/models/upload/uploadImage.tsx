'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@/components'
import React, {
  cloneElement,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import DialogFooterBtnWrapper from '@/components/layout/models/common/DialogFooterBtnWrapper'
import { useUploadFile } from '@/features'

type Props = {
  children: ReactNode
  imgUrl?: string
  setUrl: Dispatch<SetStateAction<string>>
  dialogOpen?: boolean
  setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

type CropBox = {
  x: number
  y: number
  width: number
  height: number
}
type DisplayRect = {
  w: number
  h: number
  offsetX: number
  offsetY: number
}

const ASPECT = 16 / 9
const CONTAINER_W = 320
const CONTAINER_H = 180
const MIN_CROP_WIDTH = 40

const UploadImage: React.FC<Props> = ({ children, setUrl, setDialogOpen, dialogOpen, imgUrl }) => {
  // 假定 useUploadFile 返回 { uploadFile: (file: File) => Promise<UploadResult> }
  // 若你的实现不同，微调类型断言即可（无 any）
  const { uploadFile } = useUploadFile()

  // local src (objectURL or external URL)
  const [localSrc, setLocalSrc] = useState<string | undefined>(() => imgUrl)
  const fileRef = useRef<File | null>(null)
  const lastObjectUrlRef = useRef<string | null>(null)

  // 原图像天然尺寸（像素）
  const naturalRef = useRef<{
    w: number
    h: number
  } | null>(null)

  // 图片在容器中显示的尺寸和偏移（保持等比 contain）
  const [display, setDisplay] = useState<DisplayRect>({
    w: 0,
    h: 0,
    offsetX: 0,
    offsetY: 0,
  })

  // 裁剪框（容器坐标系）
  const [crop, setCrop] = useState<CropBox>({
    x: 0,
    y: 0,
    width: CONTAINER_W,
    height: Math.round(CONTAINER_W / ASPECT),
  })

  const containerRef = useRef<HTMLDivElement | null>(null)

  // 交互 refs
  const draggingRef = useRef(false)
  const resizingRef = useRef<null | 'nw' | 'ne' | 'sw' | 'se'>(null)
  const startRef = useRef<{
    px: number
    py: number
    crop: CropBox
  } | null>(null)

  // 右侧预览 dataUrl
  const [previewDataUrl, setPreviewDataUrl] = useState<string | undefined>(undefined)

  // Dialog 内部 open 状态（若父组件没传 setDialogOpen）
  const [open, setOpen] = useState(false)

  // 如果父组件传入 imgUrl，保持同步（首次渲染或 imgUrl 变更）
  useEffect(() => {
    if (imgUrl) {
      setLocalSrc(imgUrl)
    }
  }, [imgUrl])

  // 在图片加载后计算 display rect，并初始化 crop（居中，受图片显示区域限制）
  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const natW = img.naturalWidth
    const natH = img.naturalHeight
    naturalRef.current = { w: natW, h: natH }

    const containerRatio = CONTAINER_W / CONTAINER_H
    const imgRatio = natW / natH

    let w = CONTAINER_W
    let h = CONTAINER_H
    let offsetX = 0
    let offsetY = 0

    if (imgRatio > containerRatio) {
      // 图更宽：fit 容器宽 -> 高变小
      w = CONTAINER_W
      h = Math.round(CONTAINER_W / imgRatio)
      offsetX = 0
      offsetY = Math.round((CONTAINER_H - h) / 2)
    } else {
      // 图更高：fit 容器高 -> 宽变小
      h = CONTAINER_H
      w = Math.round(CONTAINER_H * imgRatio)
      offsetY = 0
      offsetX = Math.round((CONTAINER_W - w) / 2)
    }

    setDisplay({ w, h, offsetX, offsetY })

    // 初始化 crop：宽度优先，取 display.w 的 90%（受最小值与图片高度限制）
    const initialW = Math.max(MIN_CROP_WIDTH, Math.min(w, Math.round(w * 0.9)))
    let initialH = Math.round(initialW / ASPECT)
    if (initialH > h) {
      initialH = h
    }
    const boundedW = Math.round(Math.min(initialW, w))
    const boundedH = Math.round(Math.min(initialH, h))
    const cx = Math.round(offsetX + (w - boundedW) / 2)
    const cy = Math.round(offsetY + (h - boundedH) / 2)
    setCrop({
      x: cx,
      y: cy,
      width: boundedW,
      height: boundedH,
    })

    // 立即更新预览
    setTimeout(
      () =>
        updatePreview(
          {
            x: cx,
            y: cy,
            width: boundedW,
            height: boundedH,
          },
          { w, h, offsetX, offsetY }
        ),
      0
    )
  }

  // 将容器坐标系的 crop 映射到图片原始像素
  const cropToNaturalRect = (
    c: CropBox = crop
  ): {
    sx: number
    sy: number
    sw: number
    sh: number
  } | null => {
    const nat = naturalRef.current
    if (!nat) return null
    const d = display
    if (d.w <= 0 || d.h <= 0) return null
    const sx = ((c.x - d.offsetX) * nat.w) / d.w
    const sy = ((c.y - d.offsetY) * nat.h) / d.h
    const sw = (c.width * nat.w) / d.w
    const sh = (c.height * nat.h) / d.h
    return {
      sx: Math.max(0, Math.round(sx)),
      sy: Math.max(0, Math.round(sy)),
      sw: Math.max(1, Math.round(Math.min(sw, nat.w))),
      sh: Math.max(1, Math.round(Math.min(sh, nat.h))),
    }
  }

  // 更新右侧预览（按 200px 宽生成）
  const updatePreview = async (c: CropBox = crop, _: DisplayRect = display): Promise<void> => {
    console.log(_)
    if (!localSrc) {
      setPreviewDataUrl(undefined)
      return
    }
    const natRect = cropToNaturalRect(c)
    if (!natRect) {
      setPreviewDataUrl(localSrc)
      return
    }
    const canvas = document.createElement('canvas')
    const pw = 200
    const ph = Math.round(pw / ASPECT)
    canvas.width = pw
    canvas.height = ph
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.clearRect(0, 0, pw, ph)
        ctx.drawImage(img, natRect.sx, natRect.sy, natRect.sw, natRect.sh, 0, 0, pw, ph)
        resolve()
      }
      img.src = localSrc
    })
    try {
      setPreviewDataUrl(canvas.toDataURL('image/jpeg'))
    } catch {
      setPreviewDataUrl(localSrc)
    }
  }

  // 限制裁剪框不超出图片显示区域（保持 16:9）
  const clampToImage = (candidate: CropBox, d: DisplayRect = display): CropBox => {
    const imgLeft = d.offsetX
    const imgTop = d.offsetY
    const imgRight = d.offsetX + d.w
    const imgBottom = d.offsetY + d.h

    let { x, y, width } = candidate

    // 保证最小宽度
    width = Math.max(MIN_CROP_WIDTH, Math.round(width))
    let height = Math.round(width / ASPECT)

    // 如果高度超过图片高度，则以高度为准
    if (height > d.h) {
      height = d.h
      width = Math.round(height * ASPECT)
    }

    // 再保证不超出图片边界（修正 x,y）
    if (x < imgLeft) x = imgLeft
    if (y < imgTop) y = imgTop
    if (x + width > imgRight) x = imgRight - width
    if (y + height > imgBottom) y = imgBottom - height

    // 极端情况下再次保证
    if (width > d.w) width = d.w
    if (height > d.h) height = d.h
    if (x < imgLeft) x = imgLeft
    if (y < imgTop) y = imgTop

    return {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    }
  }

  // file input change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    if (!f) return
    // revoke previous
    if (lastObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(lastObjectUrlRef.current)
      } catch {
        // ignore
      }
      lastObjectUrlRef.current = null
    }
    const url = URL.createObjectURL(f)
    lastObjectUrlRef.current = url
    fileRef.current = f
    setLocalSrc(url)
  }

  // --- 交互：使用 window pointer 监听，保证跨元素拖拽稳定 ---
  const startDrag = (px: number, py: number) => {
    startRef.current = { px, py, crop: { ...crop } }
    draggingRef.current = true
    window.addEventListener('pointermove', onWindowPointerMove)
    window.addEventListener('pointerup', onWindowPointerUp, { once: true })
  }

  const startResize = (px: number, py: number, dir: 'nw' | 'ne' | 'sw' | 'se') => {
    startRef.current = { px, py, crop: { ...crop } }
    resizingRef.current = dir
    window.addEventListener('pointermove', onWindowPointerMove)
    window.addEventListener('pointerup', onWindowPointerUp, { once: true })
  }

  const onCropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    // start dragging overall crop
    startDrag(px, py)
    // try capture on the element that received the event
    try {
      ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const onHandlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    dir: 'nw' | 'ne' | 'sw' | 'se'
  ) => {
    e.stopPropagation()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    startResize(px, py, dir)
    try {
      ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const onWindowPointerMove = (ev: PointerEvent) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const px = ev.clientX - rect.left
    const py = ev.clientY - rect.top
    const start = startRef.current
    if (!start) return

    // resizing
    if (resizingRef.current) {
      const dir = resizingRef.current
      const oc = start.crop
      const oldRight = oc.x + oc.width
      const oldBottom = oc.y + oc.height

      let newX = oc.x
      let newY = oc.y
      let newW = oc.width
      let newH = oc.height

      if (dir === 'nw') {
        newW = Math.max(MIN_CROP_WIDTH, Math.round(oldRight - px))
        newH = Math.round(newW / ASPECT)
        newX = Math.round(oldRight - newW)
        newY = Math.round(oldBottom - newH)
      } else if (dir === 'ne') {
        newW = Math.max(MIN_CROP_WIDTH, Math.round(px - oc.x))
        newH = Math.round(newW / ASPECT)
        newX = oc.x
        newY = Math.round(oldBottom - newH)
      } else if (dir === 'sw') {
        newW = Math.max(MIN_CROP_WIDTH, Math.round(oldRight - px))
        newH = Math.round(newW / ASPECT)
        newX = Math.round(oldRight - newW)
        newY = oc.y
      } else if (dir === 'se') {
        newW = Math.max(MIN_CROP_WIDTH, Math.round(px - oc.x))
        newH = Math.round(newW / ASPECT)
        newX = oc.x
        newY = oc.y
      }

      const candidate = clampToImage({
        x: newX,
        y: newY,
        width: newW,
        height: newH,
      })
      setCrop(candidate)
      void updatePreview(candidate)
      return
    }

    // dragging
    if (draggingRef.current) {
      const dx = px - start.px
      const dy = py - start.py
      const oc = start.crop
      let nx = oc.x + dx
      let ny = oc.y + dy

      // clamp within image display rect
      const imgLeft = display.offsetX
      const imgTop = display.offsetY
      const imgRight = display.offsetX + display.w
      const imgBottom = display.offsetY + display.h

      nx = Math.max(imgLeft, Math.min(nx, imgRight - oc.width))
      ny = Math.max(imgTop, Math.min(ny, imgBottom - oc.height))

      const newCrop = {
        x: Math.round(nx),
        y: Math.round(ny),
        width: oc.width,
        height: oc.height,
      }
      setCrop(newCrop)
      void updatePreview(newCrop)
    }
  }

  const onWindowPointerUp = () => {
    draggingRef.current = false
    resizingRef.current = null
    startRef.current = null
    window.removeEventListener('pointermove', onWindowPointerMove)
    // pointerup handler registered with { once: true } so OK
  }

  // 点击确认：裁剪并上传
  const handleConfirm = async (): Promise<void> => {
    if (!localSrc || !naturalRef.current) {
      if (setDialogOpen) setDialogOpen(false)
      else setOpen(false)
      return
    }
    const natRect = cropToNaturalRect()
    if (!natRect) return

    // load image to ensure crossOrigin drawing works
    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise<void>((resolve) => {
      img.onload = () => resolve()
      img.src = localSrc
    })

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, natRect.sw)
    canvas.height = Math.max(1, natRect.sh)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(
      img,
      natRect.sx,
      natRect.sy,
      natRect.sw,
      natRect.sh,
      0,
      0,
      canvas.width,
      canvas.height
    )

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), 'image/jpeg', 0.92)
    )
    if (!blob) return
    const outFile = new File([blob], fileRef.current?.name ?? 'cover.jpg', { type: 'image/jpeg' })

    let uploadUrl
    try {
      const { fileUrl } = await uploadFile(outFile)
      uploadUrl = fileUrl
    } catch (err) {
      // upload 错误时，降级为本地 dataURL

      console.error('uploadFile error', err)
      uploadUrl = null
    }

    const fileUrl = uploadUrl

    if (fileUrl) {
      setUrl(fileUrl)
    } else {
      try {
        const dataUrl = canvas.toDataURL('image/jpeg')
        setUrl(dataUrl)
      } catch {
        // nothing
      }
    }

    if (setDialogOpen) setDialogOpen(false)
    else setOpen(false)
  }

  // cleanup objectURL on unmount
  useEffect(() => {
    return () => {
      if (lastObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(lastObjectUrlRef.current)
        } catch {
          // ignore
        }
        lastObjectUrlRef.current = null
      }
      // also remove window listeners if any (defensive)
      window.removeEventListener('pointermove', onWindowPointerMove)
      window.removeEventListener('pointerup', onWindowPointerUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 当 crop 或 localSrc 或 display 变化时更新右侧预览（防抖）
  useEffect(() => {
    const t = setTimeout(() => {
      void updatePreview()
    }, 60)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    localSrc,
    display.w,
    display.h,
    display.offsetX,
    display.offsetY,
  ])

  return (
    <Dialog open={dialogOpen ?? open} onOpenChange={setDialogOpen ?? setOpen}>
      {setDialogOpen ? (
        <>{cloneElement(children as ReactElement)}</>
      ) : (
        <DialogTrigger asChild>{cloneElement(children as ReactElement)}</DialogTrigger>
      )}
      <DialogContent className={'w-[600px] p-6 pr-4'}>
        <DialogHeader>
          <DialogTitle className={'text-text1 text-center text-[16px] leading-5.5 font-medium'}>
            编辑封面
          </DialogTitle>
        </DialogHeader>

        <div className={'text-text1 mt-2 mb-6 pt-5 text-left text-sm'}>
          <div className={'flex'}>
            <div className={'mr-[30px] flex flex-none flex-col'}>
              {/* 容器：黑底 320x180 */}
              <div
                ref={containerRef}
                className={'relative h-[180px] w-[320px] overflow-hidden rounded-[6px] bg-black'}
                style={{
                  width: CONTAINER_W,
                  height: CONTAINER_H,
                }}
              >
                {/* 底图（按 display 计算放置） */}
                {localSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={localSrc}
                    alt='source'
                    onLoad={handleImgLoad}
                    style={{
                      position: 'absolute',
                      left: `${display.offsetX}px`,
                      top: `${display.offsetY}px`,
                      width: `${display.w}px`,
                      height: `${display.h}px`,
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  />
                ) : (
                  <div className='text-text3 flex h-full w-full items-center justify-center text-sm'>
                    上传一张图片
                  </div>
                )}

                {/* 裁剪框（可拖动） */}
                <div
                  className='vui_image-crop--s2 absolute'
                  style={{
                    left: `${crop.x}px`,
                    top: `${crop.y}px`,
                    width: `${crop.width}px`,
                    height: `${crop.height}px`,
                    boxSizing: 'border-box',
                    border: '1px dashed gold',
                    cursor: 'move',
                    zIndex: 30,
                    backgroundClip: 'padding-box',
                  }}
                  onPointerDown={onCropPointerDown}
                >
                  {/* 在裁剪框内绘制同一张图以实现“窗口”效果 */}
                </div>

                {/* 遮罩（暗化裁剪外区域） */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: crop.y,
                      background: 'rgba(0,0,0,0.45)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: crop.y + crop.height,
                      width: '100%',
                      height: CONTAINER_H - (crop.y + crop.height),
                      background: 'rgba(0,0,0,0.45)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: crop.y,
                      width: crop.x,
                      height: crop.height,
                      background: 'rgba(0,0,0,0.45)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: crop.x + crop.width,
                      top: crop.y,
                      width: CONTAINER_W - (crop.x + crop.width),
                      height: crop.height,
                      background: 'rgba(0,0,0,0.45)',
                    }}
                  />
                </div>

                {/* 四角手柄 */}
                {(['nw', 'ne', 'sw', 'se'] as const).map((d) => {
                  const pos: Record<
                    typeof d,
                    {
                      left: number
                      top: number
                    }
                  > = {
                    nw: {
                      left: crop.x - 6,
                      top: crop.y - 6,
                    },
                    ne: {
                      left: crop.x + crop.width - 6,
                      top: crop.y - 6,
                    },
                    sw: {
                      left: crop.x - 6,
                      top: crop.y + crop.height - 6,
                    },
                    se: {
                      left: crop.x + crop.width - 6,
                      top: crop.y + crop.height - 6,
                    },
                  }
                  const style: React.CSSProperties = {
                    position: 'absolute',
                    width: 10,
                    height: 10,
                    cursor: `${d}-resize`,
                    left: pos[d].left,
                    top: pos[d].top,
                    zIndex: 40,
                    border: '1px solid gold',
                  }
                  return (
                    <div
                      key={d}
                      style={style}
                      onPointerDown={(e) =>
                        onHandlePointerDown(e as React.PointerEvent<HTMLDivElement>, d)
                      }
                    />
                  )
                })}
              </div>
            </div>

            <div className={'flex flex-col justify-between'}>
              <div
                style={{
                  backgroundImage: previewDataUrl
                    ? `url(${previewDataUrl})`
                    : localSrc
                      ? `url(${localSrc})`
                      : undefined,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
                className={'bg-graph_bg_regular relative mt-3 h-[112.5px] w-[200px] rounded-[6px]'}
              >
                <div
                  className={
                    'bg-graph_bg_regular absolute inset-x-0 -top-1.5 m-auto h-[6px] w-[90%] rounded-t-[6px] rounded-r-[6px]'
                  }
                />
                <div
                  className={
                    'bg-graph_bg_regular absolute inset-x-0 -top-3 m-auto h-[6px] w-[80%] rounded-t-[6px] rounded-r-[6px]'
                  }
                />
              </div>
              <div className={'text-text3 mt-1.5 text-xs'}>封面预览效果</div>
              <div>
                <label
                  className={
                    'text-text2 inline-flex w-fit cursor-pointer items-center overflow-hidden text-sm'
                  }
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 16 16'
                    width='16'
                    height='16'
                  >
                    <path
                      d='M8 2.5C8.276133333333332 2.5 8.5 2.72386 8.5 3L8.5 9.933333333333334C8.5 10.209466666666666 8.276133333333332 10.433333333333334 8 10.433333333333334C7.723866666666667 10.433333333333334 7.5 10.209466666666666 7.5 9.933333333333334L7.5 3C7.5 2.72386 7.723866666666667 2.5 8 2.5z'
                      fill='currentColor'
                    />
                    <path
                      d='M11.353566666666666 5.686886666666666C11.158299999999999 5.882153333333333 10.8417 5.882153333333333 10.646433333333333 5.686886666666666L8 3.0404400000000003L5.353553333333332 5.686886666666666C5.158293333333333 5.882153333333333 4.841713333333333 5.882153333333333 4.646446666666666 5.686886666666666C4.451186666666667 5.491626666666666 4.451186666666667 5.175046666666667 4.646446666666666 4.97978L7.410733333333333 2.2154866666666666C7.736166666666667 1.8900466666666667 8.263833333333332 1.8900466666666667 8.589266666666667 2.2154866666666666L11.353566666666666 4.97978C11.5488 5.175046666666667 11.5488 5.491626666666666 11.353566666666666 5.686886666666666z'
                      fill='currentColor'
                    />
                    <path
                      d='M4.166666666666666 8.333333333333332C3.522333333333333 8.333333333333332 3 8.855666666666666 3 9.5L3 12.109066666666665C3 12.675266666666666 3.3998399999999998 13.1215 3.9255866666666663 13.169199999999998C4.827286666666666 13.251033333333334 6.185413333333333 13.333333333333332 8 13.333333333333332C9.814599999999999 13.333333333333332 11.172733333333333 13.251033333333334 12.074399999999999 13.169199999999998C12.600133333333334 13.1215 13 12.675266666666666 13 12.109066666666665L13 9.5C13 8.855666666666666 12.477666666666666 8.333333333333332 11.833333333333332 8.333333333333332L11.166666666666666 8.333333333333332C10.890533333333332 8.333333333333332 10.666666666666666 8.109466666666666 10.666666666666666 7.833333333333333C10.666666666666666 7.5572 10.890533333333332 7.333333333333333 11.166666666666666 7.333333333333333L11.833333333333332 7.333333333333333C13.029966666666667 7.333333333333333 14 8.303366666666665 14 9.5L14 12.109066666666665C14 13.153766666666666 13.243400000000001 14.067233333333334 12.1648 14.165099999999999C11.233133333333331 14.249633333333332 9.844866666666666 14.333333333333332 8 14.333333333333332C6.15512 14.333333333333332 4.766846666666666 14.249633333333332 3.8352266666666663 14.165099999999999C2.7565999999999997 14.067233333333334 2 13.153766666666666 2 12.109066666666665L2 9.5C2 8.303366666666665 2.970053333333333 7.333333333333333 4.166666666666666 7.333333333333333L4.833333333333333 7.333333333333333C5.109473333333333 7.333333333333333 5.333333333333333 7.5572 5.333333333333333 7.833333333333333C5.333333333333333 8.109466666666666 5.109473333333333 8.333333333333332 4.833333333333333 8.333333333333332L4.166666666666666 8.333333333333332z'
                      fill='currentColor'
                    />
                  </svg>
                  重新上传
                  <Input
                    className={'size-0 opacity-0'}
                    type={'file'}
                    accept={'image/png, image/jpeg, image/webp'}
                    onChange={onFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className={'mt-5 mb-1 text-[12px]'}>
            建议上传高清封面≥960*600，jpeg或png格式，图片≤5MB
          </div>
        </div>

        <DialogFooter className={'bg-bg1 mt-6 flex h-8 justify-center gap-3'}>
          <DialogFooterBtnWrapper
            cancel={'回到上一级'}
            handleConfirm={handleConfirm}
            setDialogOpen={setDialogOpen ?? setOpen}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UploadImage
