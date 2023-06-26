import { knex } from "knex"

import dotenv from 'dotenv'
dotenv.config()

// Para usar PostgreSQL
// export abstract class BaseDatabase {
//     protected static connection = knex({
//         client: "pg",
//         connection: process.env.DATABASE_URL,
//         useNullAsDefault: true, // definirá NULL quando encontrar valores undefined
//         pool: { // número de conexões
//             min: 2,
//             max: 10,
//         }
//     })
// }

// Para usar SQLite
export abstract class BaseDatabase {
    protected static connection = knex({
        client: "sqlite3",
        connection: {
            filename: process.env.DB_FILE_PATH as string
        },
        useNullAsDefault: true, // definirá NULL quando encontrar valores undefined
        pool: {
            min: 0, // número de conexões, esses valores são os recomendados para sqlite3
            max: 1,
            afterCreate: (conn: any, cb: any) => {
                conn.run("PRAGMA foreign_keys = ON", cb)
            } // configurando para o knex forçar o check das constrainst FK
        }
    })
}