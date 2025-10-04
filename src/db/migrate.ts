import 'dotenv/config';
import {migrate} from 'drizzle-orm/node-postgres/migrator';
import {db, pool} from './index';

async function main(){
    console.log("⏳ Running migrations...");
    await migrate(db, {migrationsFolder: 'src/db/migrations'});
    console.log('✅ Migrations finished!');
    await pool.end();
}

main().catch((err)=> {
    console.log(err);
    process.exit(1);
})