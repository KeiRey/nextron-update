import path from 'path'
import { app, ipcMain, dialog } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { autoUpdater } from 'electron-updater' 

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

function initAutoUpdater() {
  autoUpdater.checkForUpdatesAndNotify() // Check for updates on startup

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. Downloading now...',
    })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'A new version has been downloaded. Restart now to install the update.',
      buttons: ['Restart', 'Later'],
    }).then((result) => {
      if (result.response === 0) autoUpdater.quitAndInstall() // Restart app to install the update
    })
  })

  autoUpdater.on('error', (err) => {
    dialog.showErrorBox('Electron kntl:', err === null ? 'unknown' : (err.stack || err).toString())
  })
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }

  initAutoUpdater()
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
