import {Pool} from 'pg';
import dotenv from 'dotenv'


dotenv.config();


const pool = new Pool ({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432
})

pool.on('connect', ()=>
{
    console.log('connected to the postgres database.')
});

pool.on('error', (err)=>
{
    console.error('unexpected error occured', err)
    process.exit(-1);
})

export default pool;