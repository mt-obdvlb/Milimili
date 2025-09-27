'use client'

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ReactNode, RefObject } from 'react'

// TS 类型安全

interface SortableImageProps {
  id: string
  children: ReactNode
}

const SortableImage = ({ id, children }: SortableImageProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

interface Props {
  imageUrls: string[]
  setImageUrls: (urls: string[]) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  uploadFile: (file: File) => Promise<{ fileUrl: string }>
  imageUploadClassName?: string
}

export const FeedSortableImage = ({
  imageUrls,
  setImageUrls,
  fileInputRef,
  uploadFile,
  imageUploadClassName,
}: Props) => {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const oldIndex = imageUrls.findIndex((u) => u === active.id)
    const newIndex = imageUrls.findIndex((u) => u === over.id)
    if (oldIndex !== newIndex) {
      setImageUrls(arrayMove(imageUrls, oldIndex, newIndex))
    }
  }

  return (
    <div className={imageUploadClassName}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={imageUrls} strategy={rectSortingStrategy}>
          <div className='flex flex-wrap'>
            {imageUrls.map((url) => (
              <SortableImage key={url} id={url}>
                <div className='bg-graph_bg_regular rounded-[4px] cursor-move size-[92px] mb-2 mr-[7px] relative'>
                  <div
                    className="bg-[url('/images/feed-x.png')] bg-center bg-cover cursor-pointer size-6 absolute right-[2px] top-[2px] z-2"
                    onClick={() => setImageUrls(imageUrls.filter((item) => item !== url))}
                    onPointerDown={(e) => e.stopPropagation()}
                  ></div>
                  <div className='size-full relative'>
                    <div
                      style={{ backgroundImage: `url(${url})` }}
                      className='size-full rounded-[4px] bg-cover bg-center'
                    ></div>
                  </div>
                </div>
              </SortableImage>
            ))}

            {/* 上传按钮 */}
            <div
              className='border-2 group border-dashed border-line_regular rounded-[4px] cursor-pointer size-[92px] mb-2.5 relative transition-colors duration-300 hover:border-[#80daf6]'
              onClick={() => fileInputRef.current?.click()}
            >
              <span className='-translate-1/2 bg-graph_bg_thick rounded-[4px] h-1 left-1/2 top-1/2 absolute transition-colors group-hover:bg-[#80daf6] duration-300 w-7'></span>
              <span className='-translate-1/2 rotate-90 bg-graph_bg_thick rounded-[4px] h-1 left-1/2 top-1/2 absolute transition-colors group-hover:bg-[#80daf6] duration-300 w-7'></span>
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/*'
                multiple
                onChange={async (e) => {
                  const files = e.target.files
                  if (!files) return
                  const results = await Promise.all(Array.from(files).map((f) => uploadFile(f)))
                  const urls = results.map((r) => r.fileUrl)
                  setImageUrls([...imageUrls, ...urls])
                }}
              />
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
