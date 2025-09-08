// utils/file.ts

/**
 * 将 File 转换为本地预览 URL（Blob URL）
 * @param file File 对象
 * @returns string 预览用的本地 URL
 */
export const fileToBlobUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

/**
 * 将 File 转换为 Base64 编码
 * @param file File 对象
 * @returns Promise<string> Base64 字符串
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
