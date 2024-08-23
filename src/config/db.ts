import mysql from 'mysql'

const mysqlConnection = mysql.createConnection({
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.dbSchema,
    multipleStatements: true
  })
  
mysqlConnection.connect((err: Error) => {
    if (err) {
        console.error(err)
    } 
    console.log('db is connected')
})


async function listQuery<Value>(query: string): Promise<[Value]> {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, (err, rows, fields) => {
            if (err) reject(err)

            if (!rows[0]) reject(new Error('no Data Found') as CustomError)

            const data: [Value] = JSON.parse(JSON.stringify(rows[0]))
            resolve(data)
            
            })  
    })
}

async function itemQuery<Value>(query: string): Promise<Value> {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, (err, rows, fields) => {
            if (err) reject(err)

            if (!rows[0]) reject(new Error('no Data Found') as CustomError)

            const data: Value = JSON.parse(JSON.stringify(rows[0][0]))
            resolve(data)
            
            })  
    })
}

async function modifyQuery(query: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, (err, rows, fields) => {
            if (err) reject(err)
            resolve(rows.affectedRows > 0)            
            })  
    })
}


export {
    mysqlConnection,
    listQuery,
    itemQuery,
    modifyQuery
}