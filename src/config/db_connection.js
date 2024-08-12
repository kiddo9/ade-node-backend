/*const {Sequelize} = require('sequelize');

const Connection = new Sequelize('postgresql://postgres.irkrmdwtasxwzpfiuxja:2by5_tLay*CDQVd@aws-0-eu-central-1.pooler.supabase.com:6543/postgres');
const connect = Connection.authenticate();

if(connect){
    console.log('connected');
}else{
    console.log('not connected');
}

module.exports = Connection*/

const {Client} = require('pg')

const client = new Client('postgresql://postgres.irkrmdwtasxwzpfiuxja:2by5_tLay*CDQVd@aws-0-eu-central-1.pooler.supabase.com:6543/postgres')
const Connect = client.connect();

if(Connect){
    console.log('connected');
}else{
    console.log('not connected');
}

module.exports = client