const fs = require('fs');
const unzipper = require('unzipper');
const csv = require('csv-parser');
const { Sequelize } = require('sequelize');



// กำหนดข้อมูลเชื่อมต่อฐานข้อมูล PostgreSQL
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'postgres',
// });
const sequelize = require('../database');

// กำหนดโมเดลของตารางในฐานข้อมูล
// const File = sequelize.define('File', {
//   // ตั้งค่าฟิลด์ตามความต้องการ
//   // เช่น name, data, หรืออื่น ๆ
// });

// เชื่อมโมเดลกับฐานข้อมูล
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  exports.deleteAllData = async () => {
    try {
      await File.destroy({
        where: {},
        truncate: true
      });
      console.log('All data deleted successfully.');
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  };

  exports.uploadAndExtractZip = async (zipFilePath) => {
    try {
    //    await deleteAllData();
      console.log('Data deleted successfully.');
      
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Parse())
        .on('entry', (entry) => {
          const fileName = entry.path;
          const fileType = entry.type;
  
          if (fileType === 'File' && fileName.endsWith('.csv')) {
            const tableName = fileName.split('.')[0];
            //  const stringWithoutSubstring = tableName.replace('_export', '');
              // console.log("---------------------------->>"+stringWithoutSubstring)
            const Model = sequelize.models[tableName];
  
            if (Model) {
              entry.pipe(csv())
                .on('data', (row) => {
                  Model.destroy({ truncate: true })
                  Model.create(row)
                    .then(() => console.log('Data inserted successfully'))
                    .catch((err) => console.error('Error inserting data:', err));
                })
                .on('error', (err) => {
                  console.error('Error reading CSV file:', err);
                });
            } else {
              console.warn(`Table ${tableName} not found in the database.`);
              entry.autodrain();
            }
          } else {
            entry.autodrain();
          }
        })
        .on('finish', () => {
          console.log('Finished processing zip file.');
        })
        .on('error', (err) => {
          console.error('Error processing zip file:', err);
        });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

