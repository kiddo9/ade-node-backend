require('dotenv').config() // import the dotenv package 
const {Sequelize} = require('sequelize') //import sequelize (ORM)
const pg = require('pg')  // Import pg module for PostgreSQL dialect
 

//connect your database
const connection = new Sequelize('postgresql://postgres.irkrmdwtasxwzpfiuxja:2by5_tLay*CDQVd@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', {
    dialectModule: pg
});


(async () => {

try {
    // Test database connection
   await connection.authenticate()
    console.log("database is connected and secured successfully");
    
} catch (error) {
    console.log("error: ", error);
}
})();

module.exports = connection //export connection


