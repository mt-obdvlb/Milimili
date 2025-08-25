// replace-svg-attrs.ts
import fs from 'fs'
import path from 'path'

// 需要替换的属性映射
const ATTR_MAP: Record<string, string> = {
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'view-box': 'viewBox',
  'color-interpolation-filters': 'colorInterpolationFilters',
  // 可以继续添加更多
}

// 遍历文件夹并处理.tsx文件
const processFolder = (folderPath: string) => {
  const files = fs.readdirSync(folderPath)

  files.forEach((file) => {
    const fullPath = path.join(folderPath, file)
    const stats = fs.statSync(fullPath)

    if (stats.isDirectory()) {
      processFolder(fullPath)
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8')

      // 遍历属性映射并替换
      Object.entries(ATTR_MAP).forEach(([oldAttr, newAttr]) => {
        // 使用正则匹配属性名称
        const regex = new RegExp(`\\b${oldAttr}\\b`, 'g')
        content = content.replace(regex, newAttr)
      })

      fs.writeFileSync(fullPath, content, 'utf-8')
      console.log(`Processed: ${fullPath}`)
    }
  })
}

// 使用方法：node replace-svg-attrs.js ./src/components
const targetFolder = process.argv[2]
if (!targetFolder) {
  console.error('请提供目标文件夹路径')
  process.exit(1)
}

processFolder(path.resolve(targetFolder))
