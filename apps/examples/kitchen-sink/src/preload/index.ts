import { setupPreload } from '@electron-ipc-controller/core/preload'
import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

setupPreload('custom').catch(console.error)

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
} catch (error) {
  console.error(error)
}
