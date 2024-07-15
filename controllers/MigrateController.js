const fs = require("fs");
const { User, Role, UserActivity } = require("../model/userModel"); // call model
const {Product,productType,productCategory,Transaction,} = require("../model/productModel"); // call model
const {Employee,Position,Salary_pay,Department,} = require("../model/employeeModel"); // call model
const ResponseManager = require("../middleware/ResponseManager");
const pgp = require("pg-promise")();
const sequelize = require("../database");
const archiver = require('archiver');
const path = require('path');
const csv = require('csv-parser');
const { QueryTypes } = require('sequelize');
const multer = require('multer');
var upload = multer({ dest: 'import/'});
const unzipper = require('unzipper');


const sourceDB = pgp({
  connectionString:
    "postgres://postgres:123456@localhost:5432/Test_VueJS_Project",
});
const { Sequelize , DataTypes } = require('sequelize');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class MigrateController {

  static async deploydata(req, res) {
    try {
      const userMove = await sourceDB.query("SELECT * FROM users");
      const salaryMove = await sourceDB.query("SELECT * FROM salary_payments");
      const rolesMove = await sourceDB.query("SELECT * FROM roles");
      const productsMove = await sourceDB.query("SELECT * FROM products");
      const producttypesMove = await sourceDB.query(
        "SELECT * FROM product_types"
      );
      const producttransactionsMove = await sourceDB.query(
        "SELECT * FROM product_transactions"
      );
      const productcategoriesMove = await sourceDB.query(
        "SELECT * FROM product_categories"
      );
      const positionsMove = await sourceDB.query("SELECT * FROM positions");
      const employeesMove = await sourceDB.query("SELECT * FROM employees");
      const departmentsMove = await sourceDB.query("SELECT * FROM departments");
      const UserActivitiesMove = await sourceDB.query(
        'SELECT * FROM public."UserActivities"'
      );

      // Insert data into the destination database using bulkCreate
      await User.destroy({ truncate: true });
      await Salary_pay.destroy({ truncate: true });
      await Role.destroy({ truncate: true });
      await Product.destroy({ truncate: true });
      await productType.destroy({ truncate: true });
      await Transaction.destroy({ truncate: true });
      await productCategory.destroy({ truncate: true });
      await Position.destroy({ truncate: true });
      await Employee.destroy({ truncate: true });
      await Department.destroy({ truncate: true });
      await UserActivity.destroy({ truncate: true });

      await User.bulkCreate(userMove);
      await Salary_pay.bulkCreate(salaryMove);
      await Role.bulkCreate(rolesMove);
      await Product.bulkCreate(productsMove);
      await productType.bulkCreate(producttypesMove);
      await Transaction.bulkCreate(producttransactionsMove);
      await productCategory.bulkCreate(productcategoriesMove);
      await Position.bulkCreate(positionsMove);
      await Employee.bulkCreate(employeesMove);
      await Department.bulkCreate(departmentsMove);
      await UserActivity.bulkCreate(UserActivitiesMove);

      res.status(200).json({ message: "Data moved successfully" });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      pgp.end();
    }
  }

  static async tablelist(req, res) {
    try {
      const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
  `;

      const [results, metadata] = await sequelize.query(query);

      const tableNames = results.map((row) => row.table_name);
      res.json({ tableNames });
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }



  static async exportCsv(req, res) {
      try {
        const tableName = req.params.tableName;
        const data = await sequelize.query(`SELECT * FROM ${tableName}`, {
          type: Sequelize.QueryTypes.SELECT,
        });
        // console.log(data)
  
        if (data.length === 0) {
          return res.status(404).json({ error: 'Table not found or empty' });
        }
  
        const csvWriter = createCsvWriter({
          path: `${__dirname}/../export/${tableName}.csv`,
          header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
        });
       
        csvWriter.writeRecords(data)
          .then(() => {
            res.download(`${__dirname}/../export/${tableName}.csv`, `${tableName}.csv`, (err) => {
              if (err) {
                console.error('Error downloading CSV file:', err);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                console.log('CSV file downloaded successfully');
              }
            });
          })
          .catch((error) => {
            console.error('Error writing CSV records:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }

static async exportAllCsv(req, res) {
  try {
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
    `;
  
    const [results, metadata] = await sequelize.query(query);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No tables found' });
    }

    // Extract table names directly from result rows
    const tableNames = results.map((row) => row.table_name);

    // Create a zip file
    const zipFilePath = path.join(`${__dirname}/../export/`, 'exported_files.zip');
    const zipStream = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    zipStream.on('close', () => {
      // Send the zip file as a response
      res.download(zipFilePath, 'exported_files.zip', (err) => {
        if (err) {
          console.error('Error downloading zip file:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          // Remove the zip file after sending
          fs.unlinkSync(zipFilePath);

          // Remove individual CSV files
          for (const tableName of tableNames) {
            const csvFilePath = path.join(`${__dirname}/../export/`, `${tableName}.csv`);
            
            // Check if the file exists before attempting to unlink
            if (fs.existsSync(csvFilePath)) {
              fs.unlinkSync(csvFilePath);
              console.log(`CSV file ${tableName}_export.csv removed successfully`);
            } else {
              console.log(`CSV file ${tableName}_export.csv not found. Skipping...`);
            }
          }

          console.log('Zip file downloaded successfully');
        }
      });
    });

    archive.pipe(zipStream);

    // Export CSV for each table and add to the zip file
    for (const tableName of tableNames) {
      const data = await sequelize.query(`SELECT * FROM "${tableName}"`, {
        type: Sequelize.QueryTypes.SELECT,
      });

      // Check if data exists before creating CSV
      if (data.length > 0) {
        const csvWriter = createCsvWriter({
          path: path.join(`${__dirname}/../export/`, `${tableName}.csv`),
          header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
        });

        await csvWriter.writeRecords(data);

        // Append CSV file to the zip file
        archive.append(fs.createReadStream(path.join(`${__dirname}/../export/`, `${tableName}.csv`)), {
          name: `${tableName}.csv`,
        });
      } else {
        console.log(`No data found for table: ${tableName}. Skipping...`);
        continue; // Skip to the next iteration of the loop
      }
    }

    // Finalize the zip file
    archive.finalize();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

    static async importCsv(req, res) {
      try {
        const results = [];
    
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            const tableName = req.body.tableName; // ระบุชื่อของตารางที่ต้องการ
            const columns = results[0]; // สมมติว่า columns ถูกส่งมาเป็น array แล้ว
    
            try {
              await sequelize.transaction(async (transaction) => {
                // Create table if not exists
                await sequelize.query(`CREATE TABLE IF NOT EXISTS "${tableName}" (${Object.keys(columns).map(key => `"${key}" TEXT`).join(", ")})`, { transaction });
    
                // Delete existing data from the table
                await sequelize.query(`DELETE FROM "${tableName}"`, { type: QueryTypes.DELETE, transaction });
    
                // Insert new data into the table
                for (const row of results) {
                  const insertQuery = `INSERT INTO "${tableName}" (${Object.keys(row).map(key => `"${key}"`).join(", ")}) VALUES (${Object.values(row).map(value => `'${value}'`).join(", ")})`;
                  await sequelize.query(insertQuery, { transaction });
                }
              });
    
              res.status(200).json({ message: 'CSV file uploaded and data updated successfully' });
            } catch (error) {
              console.error('Error processing CSV data:', error);
              res.status(500).json({ error: 'Failed to process CSV data' });
            }
          });
      } catch (error) {
        console.error('Error uploading CSV file:', error);
        res.status(500).json({ error: 'Failed to upload CSV file' });
      }
    }

    static async importAllCsv(req, res) {
      try {
        const zipFilePath = req.file.path;
        const extractPath = path.join(__dirname, 'extracted_files');
  
        // Extract the contents of the zip file
        await fs.promises.mkdir(extractPath, { recursive: true });
        await fs.createReadStream(zipFilePath).pipe(unzipper.Extract({ path: extractPath })).promise();
  
        // Get a list of CSV files in the extracted folder
        const csvFiles = await fs.promises.readdir(extractPath);
  
        // Update the database for each CSV file
        for (const csvFile of csvFiles) {
          const tableName = path.basename(csvFile, '.csv');
          console.log(tableName)
  
          // Check if the table exists in the database
          const tableExists = await sequelize.query(
            `SELECT table_name
             FROM information_schema.tables
             WHERE table_schema = 'public'
             AND table_name = :tableName`,
            {
              type: QueryTypes.SELECT,
              replacements: {  tableName },
            }
          );
  
          if (!tableExists.length) {
            console.error(`Table ${tableName} not found. Skipping.`);
            continue;
          }
  
          // Read the CSV file
          const csvFilePath = path.join(extractPath, csvFile);
          const uploadedData = await readUploadedCsv(csvFilePath);
          
  
          // Update your database with the uploaded data
          await sequelize.transaction(async (t) => {
            // Delete existing data in the table
          await sequelize.query(`DELETE FROM ${tableName}`, { transaction: t });

          

            // Bulk create the new data
          await sequelize.models[tableName].bulkCreate(uploadedData, { transaction: t });
          });
  
          console.log(`Data updated for table ${tableName}`);
        }
  
        // Send a response indicating success
        res.status(200).json({ message: 'CSV files uploaded and data updated successfully' });
  
        // Clean up extracted files
        await fs.promises.rm(extractPath, { recursive: true });
  
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }


    static async updateAllTables(zipFilePath) {
      try {
        // Extract CSV files from the uploaded zip
        const extractedDir = 'extracted_files';
        fs.mkdirSync(extractedDir);
    
        await fs.createReadStream(zipFilePath)
          .pipe(unzipper.Extract({ path: extractedDir }))
          .promise();
    
        const csvFiles = fs.readdirSync(extractedDir);
    
        // Update data in all tables
        for (const csvFile of csvFiles) {
          if (csvFile.endsWith('.csv')) {
            const tableName = path.basename(csvFile, '.csv');
            const filePath = path.join(extractedDir, csvFile);
            await this.updateTableData(tableName, filePath);
          }
        }
    
        // Cleanup extracted files
        fs.rmdirSync(extractedDir, { recursive: true });
      } catch (error) {
        console.error('Error updating tables:', error);
        throw error;
      }
    }
  
    static async updateTableData(tableName, csvFilePath) {
      try {
        const data = await sequelize.query(`SELECT * FROM "${tableName}"`, {
          type: Sequelize.QueryTypes.SELECT,
        });
  
        if (data.length > 0) {
          const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
          });
  
          await csvWriter.writeRecords(data);
        }
      } catch (error) {
        console.error(`Error updating data for table ${tableName}:`, error);
        throw error;
      }
    }
}

 async function readUploadedCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

module.exports = MigrateController;
