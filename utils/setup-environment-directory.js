const fs = require('fs')
const path = require('path')

module.exports = ({ baseDirName }) => {
  // 圖片上傳路徑
  if (fs.existsSync(path.join(baseDirName, 'uploads'))) {
    fs.mkdirSync(path.join(baseDirName, 'uploads'))
  }
  if (fs.existsSync(path.join(baseDirName, 'uploads', 'image'))) {
    fs.mkdirSync(path.join(baseDirName, 'uploads', 'image'))
  }
  if (fs.existsSync(path.join(baseDirName, 'uploads', 'avatar'))) {
    fs.mkdirSync(path.join(baseDirName, 'uploads', 'avatar'))
  }

  if (
    process.env.ENABLE_DOCS_UI === 'true' &&
    fs.existsSync(path.join(baseDirName, 'docs'))
  ) {
    fs.mkdirSync(path.join(baseDirName, 'docs'))
  }

  if (
    process.env.ENABLE_LOG_RECORDER === 'true' &&
    fs.existsSync(path.join(baseDirName, 'logs'))
  ) {
    fs.mkdirSync(path.join(baseDirName, 'logs'))
  }
}
