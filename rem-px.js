#! /usr/bin/env node
const fs = require('fs')
const path = require('path')
const files = []
const dir = './vab-icons'

/**
 * Loop through all files in a directory and subdirectories
 * @param dir
 */
function loopDirectory(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const item = file.substring(file.indexOf('.') + 1)
    const Absolute = path.join(dir, file)
    if (fs.statSync(Absolute).isDirectory()) {
      return loopDirectory(Absolute)
    } else {
      if (item === 'vue' || item === 'scss' || item === 'css') {
        return files.push(Absolute)
      }
    }
  })
}

loopDirectory(dir)

/**
 * Loop through all files and replace rem values to px
 */

files.forEach((element) => {
  const contents = fs.readFileSync(element, 'utf8')
  const splitOn = ':'
  const lines = contents.split(splitOn)
  const remRegex = new RegExp('(\\d.?\\d?)(px)')
  let replacedCount = 0
  const finalLines = lines.map((line) => {
    if (line.includes('px')) {
      const matches = line.match(remRegex)
      if (matches && matches.length === 3) {
        replacedCount++
        const newLine = line.replace(matches[0], `${matches[1] / 16}rem`)
        return newLine
      }
    }
    return line
  })
  const finalContent = finalLines.join(splitOn)
  try {
    fs.writeFileSync(element, finalContent)
  } catch (error) {
    console.log('[rem-to-px] error while persisting file', error)
    return
  }
  console.log('[rem-to-px] replaced', replacedCount, 'rem values to px')
})
