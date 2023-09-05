//import { useRecoilState } from "recoil";
//import { productDialogAtom } from './States/Atoms/buttons'

//const productDialogAtom = import("./States/Atoms/buttons")

const { app, BrowserWindow, nativeTheme, remote } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const { globalShortcut, ipcMain } = require('electron')

require('@electron/remote/main').initialize()
//const useRecoil = new useRecoilState()

function NewuserButton() {
  //console.log(productDialogAtom)
  //const [productDialog, setProductDialog] = useState(remote.getGlobal("productDialog"));

  // Set MyGlobalVariable.
  //ipcRenderer.send('show-syncSpinner-event', "true");  //remote.getGlobal('MyGlobalObject').variable_1= '4567'

  //ipcRenderer.on('spin', (event, arg) => {
  //Do stuff with the arg variable you have passed to and from your main process
  console.log('Button')
  //});

  //setProductDialog(true)
  //console.log(productDialog)
}

let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 400,
    resizable: false,
    fullscreen: true,
    center: true,
    autoHideMenuBar: true,
  // icon: `${__dirname}/favicon.ico`
  })

  nativeTheme.themeSource = 'dark'
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  win.maximize()
}

app.on('ready', createWindow)

ipcMain.handle('quit-app', () => {
  app.quit();
});

app.on('browser-window-focus', function () {
  globalShortcut.register('CommandOrControl+R', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled')
    //ipcMain.handle('dialog:openFile', NewuserButton)
  })
  globalShortcut.register('F5', () => {
    console.log('F5 is pressed: Shortcut Disabled')
  })
})
app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R')
  globalShortcut.unregister('F5')
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('toMain', (event, args) => {
  // Do something with file contents

  // Send result back to renderer process
  win.webContents.send('fromMain', true)
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
