const PROCESS_ENV = require('config')
const fs = require('fs')
const path = require('path')

module.exports = ({ baseDirName }) => {
  // 圖片上傳路徑
  if (!fs.existsSync(path.join(baseDirName, 'uploads'))) {
    fs.mkdirSync(path.join(baseDirName, 'uploads'))
  }
  if (!fs.existsSync(path.join(baseDirName, 'uploads', 'image'))) {
    fs.mkdirSync(path.join(baseDirName, 'uploads', 'image'))
  }
  if (!fs.existsSync(path.join(baseDirName, 'uploads', 'avatar'))) {
    fs.mkdirSync(path.join(baseDirName, 'uploads', 'avatar'))
  }

  if (
    PROCESS_ENV.ENABLE_DOCS_UI &&
    !fs.existsSync(path.join(baseDirName, 'docs'))
  ) {
    fs.mkdirSync(path.join(baseDirName, 'docs'))
  }

  if (
    PROCESS_ENV.ENABLE_LOG_RECORDER &&
    !fs.existsSync(path.join(baseDirName, 'logs'))
  ) {
    fs.mkdirSync(path.join(baseDirName, 'logs'))
  }
}
