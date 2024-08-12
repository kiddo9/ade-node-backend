require('dotenv')
const {createClient} = require('@supabase/supabase-js')

const supabaseUrl = 'https://irkrmdwtasxwzpfiuxja.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlya3JtZHd0YXN4d3pwZml1eGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2NTcxNjcsImV4cCI6MjAzODIzMzE2N30.Kua6axvVNEcjYksoPO2cr2u47_VBtM4h-QYsDmC8iJ8'
const supabase = createClient(supabaseUrl, supabaseKey)

if(supabase){
    console.log('connected well');
}else{
    console.log('error');
    
}

module.exports = supabase