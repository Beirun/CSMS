import fs from 'fs';
import path from 'path';
import pool from './db.js';
import { time } from 'console';

// Path to the poke-icons folder
const iconsFolder = path.join("../client/src/components/icons", 'poke-icons');

// Read all files from the poke-icons folder
fs.readdir(iconsFolder, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    files.forEach((file, index) => {
      // Check if the file is an SVG file
      if (path.extname(file) === '.svg') {
        // Read the SVG file
        const svgBuffer = fs.readFileSync(path.join(iconsFolder, file));
        const poke_name = file.substring(file.indexOf('-')+1, file.indexOf('.'));
        // Insert the SVG icon into the database
        setTimeout(() => {
          pool.query('INSERT INTO pokemon_icon (poke_id, poke_name, poke_icon) VALUES ($1, $2, $3)', [index+1, poke_name, svgBuffer], (err, results) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Inserted icon: ${file}`);
            }
          });
        }, 500);
      }
      
    });
  }
});