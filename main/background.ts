import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { dialog } from 'electron';
import { promises as fs } from 'fs';
import { parse as json2csv } from 'json2csv';

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}



(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main13", {
    width: 1400,
    height: 800,
    center: true,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./login.html");

    ipcMain.on("download", (event, data) => {
      try {
        // Convert the JSON data to CSV format
        const csv = json2csv(data);
     
        // Open the "Save As" dialog
        dialog.showSaveDialog(mainWindow,{
          filters: [{ name: 'CSV Files', extensions: ['csv'] }]
        }).then(async (filename) => {
          console.log(filename);
          if (filename) {
            try {
              // If the user clicked "Save", write the CSV data to the file
              await fs.writeFile(filename.filePath, csv);
              console.log('File saved successfully!');
            } catch (err) {
              console.error('Error saving file:', err);
            }
          } else {
            console.log('User clicked "Cancel"');
          }
        });
      } catch (err) {
        console.error('Error exporting to CSV:', err);
      }
    });

  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/login`);
    ipcMain.on("download", (event, data) => {
      try {
        // Convert the JSON data to CSV format
        const csv = json2csv(data);
    
        // Open the "Save As" dialog
        dialog.showSaveDialog(mainWindow,{
          filters: [{ name: 'CSV Files', extensions: ['csv'] }]
        }).then(async (filename) => {
          console.log(filename);
          if (filename) {
            try {
              // If the user clicked "Save", write the CSV data to the file
              await fs.writeFile(filename.filePath, csv);
              console.log('File saved successfully!');
            } catch (err) {
              console.error('Error saving file:', err);
            }
          } else {
            console.log('User clicked "Cancel"');
          }
        });
      } catch (err) {
        console.error('Error exporting to CSV:', err);
      }
    });
    mainWindow.webContents.openDevTools();
  }
})();




app.on("window-all-closed", () => {
  app.quit();
});
