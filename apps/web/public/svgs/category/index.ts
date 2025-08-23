import fs from 'fs'
import path from 'path'

/**
 * 遍历目录下所有文件
 * @param dir 目录路径
 * @param ext 文件扩展名
 * @returns 文件路径数组
 */
const getFiles = (dir: string, ext: string): string[] => {
  let results: string[] = []
  const list = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of list) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      results = results.concat(getFiles(fullPath, ext))
    } else if (file.isFile() && file.name.endsWith(ext)) {
      results.push(fullPath)
    }
  }
  return results
}

/**
 * 修复 SVG 文件空体标签
 * @param content SVG 文件内容
 */
const fixSvgEmptyTags = (content: string): string => {
  return content.replace(/<(\w+)([^>]*)><\/\1>/g, '<$1$2 />')
}

/**
 * 删除未使用的命名空间（比如 xmlns:xlink）
 * @param content SVG 文件内容
 */
const removeUnusedNamespaces = (content: string): string => {
  return content.replace(/\s+xmlns:xlink="[^"]*"/g, '')
}

/**
 * 处理单个 SVG 文件
 * @param filePath 文件路径
 */
const processSvgFile = (filePath: string) => {
  let content = fs.readFileSync(filePath, 'utf-8')
  content = fixSvgEmptyTags(content)
  content = removeUnusedNamespaces(content)
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Processed: ${filePath}`)
}

// 使用示例
const svgDir = path.resolve('./') // 替换成你的 SVG 文件夹
const svgFiles = getFiles(svgDir, '.svg')

svgFiles.forEach(processSvgFile)

console.log('All SVGs processed!')
