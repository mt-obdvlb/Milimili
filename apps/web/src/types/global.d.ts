// global.d.ts
export {} // 确保文件是模块

declare global {
  // 先声明类
  class CommentManager implements ICommentManager {
    public options: CCLOptions
    public timeline: object[]
    public runline: IComment[]
    public position: number
    public factory: ICommentFactory
    private _listeners: {
      [name: string]: Array<() => void>
    }
    private _csa: { [name: string]: CommentSpaceAllocator }

    constructor(stage: HTMLDivElement)

    private _width: number
    get width(): number

    private _height: number

    get height(): number

    private _status: string

    get status(): string

    private _stage: HTMLDivElement

    get stage(): HTMLDivElement

    time(t: number): void

    init(): void

    start(): void

    stop(): void

    clear(): void

    setBounds(width?: number, height?: number): void

    send(data: object): void

    insert(data: object, index?: number): void

    load(data: object[]): void

    finish(cmt: IComment): void

    addEventListener(name: string, listener: (data?: unknown) => void): void

    dispatchEvent(name: string, data?: unknown): void

    addAllocator(name: string, allocator: CommentSpaceAllocator): void
  }

  // 然后在 Window 上声明类型
  interface Window {
    CommentManager: typeof CommentManager
  }
}
