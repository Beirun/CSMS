import pg, { Pool } from 'pg';



const pool : Pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ccs',
    password: 'root',
    port: 5432,
})
export default pool