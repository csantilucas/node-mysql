require('dotenv').config();
const mysql = require('mysql2/promise');
const connString = process.env.CONNECTION_STRING;

async function conect() {
    let conection;
    try {
        // 3. 'await' funciona corretamente com a versão promise
        conection = await mysql.createConnection(connString);
        console.log("Conectado com sucesso!");

        const create = `
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            );
        `;

        await conection.execute(create)
        console.log(`tabela criada`)

        const insertQuery = `
            INSERT INTO usuarios (nome, email) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE nome=VALUES(nome); 
        `;
        
        // Passamos os valores como um array para evitar SQL Injection
        await conection.execute(insertQuery, ['Usuario Teste', 'teste@email.com']);
        console.log("Usuário de teste inserido/atualizado.");


        // --- 3. VISUALIZAR OS DADOS (SELECT) ---
        const selectQuery = "SELECT * FROM usuarios";
        
        // O resultado do SELECT vem em um array [rows, fields]
        // Estamos pegando apenas o 'rows' (as linhas de dados)
        const [rows] = await conection.execute(selectQuery);
        console.log(rows)


    } catch (erro) {
        // Use console.error para logs de erro
        console.error("Erro ao conectar:", erro);

    } finally {
        if (conection){
            await conection.end()
        }
    }
}

conect();