const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Open VLC instances with network stream URLs
  const stream1 = 'http://example.com/stream1';
  const stream2 = 'http://example.com/stream2';

  exec(`"C:\\Program Files\\VideoLAN\\VLC\\vlc.exe" ${stream1} --extraintf http --http-port=8080 --no-video-deco --no-embedded-video`);
  exec(`"C:\\Program Files\\VideoLAN\\VLC\\vlc.exe" ${stream2} --extraintf http --http-port=8081 --no-video-deco --no-embedded-video`);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
