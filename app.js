const express = require('express')
const session = require('express-session')
const sqlite3 = require('sqlite3').verbose()
const app = express()

// Configurar engine de visualização
app.set('view engine', 'ejs')

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(session({
    secret: 'sua-chave-secreta',
    resave: false,
    saveUninitialized: true
}))

// Middleware para verificar autenticação
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next()
    }else {
        res.redirect('/?error=Você precisa estar logado para acessar esta página')
    }
}

// Conexão SQLite
const db = new sqlite3.Database('./sistema.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message)
    } else {
        console.log('Conectado ao banco de dados SQLite.')
        // Habilitar foreign keys
        db.run('PRAGMA foreign_keys = ON')

        // Criar tabela de usuários se não existir
        db.run(`CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela admin:', err.message)
            } else {
                // Inserir usuário padrão se não existir
                db.run(`INSERT OR IGNORE INTO admin (username, password) VALUES (?, ?)`, ['admin', 'password'], (err) => {
                    if (err) {
                        console.error('Erro ao inserir usuário padrão:', err.message)
                    }
                })
            }
        })

        // Criar tabela projetores se não existir
        db.run(`CREATE TABLE IF NOT EXISTS projetores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela projetores:', err.message)
            } else {
                // Inserir projetores padrão se não existirem
                const stmt = db.prepare(`INSERT OR IGNORE INTO projetores (nome) VALUES (?)`)
                ;['Projetor 1', 'Projetor 2', 'Projetor 3', 'Projetor 4', 'Projetor 5', 'Projetor 6', 'Projetor 7', 'Projetor 8'].forEach(nome => stmt.run(nome))
                stmt.finalize()
            }
        })

        // Criar tabela caixa_de_som se não existir
        db.run(`CREATE TABLE IF NOT EXISTS caixa_de_som (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            caixa TEXT UNIQUE
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela caixa_de_som:', err.message)
            } else {
                // Inserir caixas de som padrão se não existirem
                const stmt = db.prepare(`INSERT OR IGNORE INTO caixa_de_som (caixa) VALUES (?)`)
                ;['Caixa P', 'Caixa M', 'Caixa G'].forEach(caixa => stmt.run(caixa))
                stmt.finalize()
            }
        })

        // Criar tabela alocacao se não existir
        db.run(`CREATE TABLE IF NOT EXISTS alocacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_projetor TEXT,
            professor TEXT,
            sala TEXT,
            caixa TEXT,
            status TEXT DEFAULT 'alocado',
            data_alocacao TEXT,
            hora_alocacao TEXT,
            FOREIGN KEY (numero_projetor) REFERENCES projetores(nome),
            FOREIGN KEY (caixa) REFERENCES caixa_de_som(caixa),
            FOREIGN KEY (professor) REFERENCES professores(nome)
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela alocacao:', err.message)
            }
        })

        // Criar tabela professores se não existir
        db.run(`CREATE TABLE IF NOT EXISTS professores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela professores:', err.message)
            } else {
                // Inserir professores padrão se não existirem
                const stmt = db.prepare(`INSERT OR IGNORE INTO professores (nome) VALUES (?)`)
                ;['Márcia', 'Nathalia Inglês', 'Natalia Ed. Física', 'Val', 'Carla', 'Kilvia', 'Iolanda', 'Vanuska', 'Elisa', 'Rosilene', 'Viviane', 'Auxi', 'Fernanda', 'Cristina', 'Breno', 'Elizeu', 'Edimir', 'Lucas', 'Marcelo', 'Bruno', 'Meneses', 'Fernando', 'Felipe', 'Wesley', 'Walfrido', 'William', 'Kelly', 'Aureliano'].forEach(nome => stmt.run(nome))
                stmt.finalize()
            }
        })
    }
})

// Rotas
app.get('/', (req, res) => {
    const error = req.query.error || null
    res.render('login', { error })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    db.get('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) throw err
        if (row) {
            req.session.user = row
            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err)
                    res.render('login', { error: 'Erro interno do servidor' })
                } else {
                    res.redirect('/alocacao')
                }
            })
        } else {
            res.render('login', { error: 'Credenciais inválidas' })
        }
    })
})

app.get('/alocacao', isAuthenticated, (req, res) => {
    // Buscar projetores
    db.all('SELECT * FROM projetores', (err, projetores) => {
        if (err) throw err
        // Buscar caixas de som
        db.all('SELECT * FROM caixa_de_som', (err, caixas) => {
            if (err) throw err
            // Buscar professores
            db.all('SELECT * FROM professores', (err, professores) => {
                if (err) throw err
                res.render('home', { projetores, caixas, professores, error: null })
            })
        })
    })
})

app.get('/alocacoes', isAuthenticated, (req, res) => {
    // Buscar alocações ativas
    db.all('SELECT a.id, a.professor, a.sala, p.nome as projetor, c.caixa, a.data_alocacao, a.hora_alocacao FROM alocacao a JOIN projetores p ON a.numero_projetor = p.nome LEFT JOIN caixa_de_som c ON a.caixa = c.caixa WHERE a.status = "alocado"', (err, alocacoes) => {
        if (err) throw err
        const success = req.session.success
        if(success) delete req.session.success
        res.render('alocacoes',{alocacoes, success})
    })
})

app.get('/equipamentos-devolvidos', isAuthenticated, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Buscar total de equipamentos devolvidos
    db.get('SELECT COUNT(*) as total FROM alocacao WHERE status = "entregue"', (err, countResult) => {
        if (err) throw err;
        const total = countResult.total;
        const totalPages = Math.ceil(total / limit);

        // Buscar equipamentos devolvidos com paginação
        db.all(`SELECT a.id, a.professor, a.sala, p.nome as projetor, c.caixa, a.data_alocacao, a.hora_alocacao FROM alocacao a JOIN projetores p ON a.numero_projetor = p.nome LEFT JOIN caixa_de_som c ON a.caixa = c.caixa WHERE a.status = "entregue" ORDER BY a.data_alocacao DESC, a.hora_alocacao DESC LIMIT ? OFFSET ?`, [limit, offset], (err, entregues) => {
            if (err) throw err;
            res.render('equipamentos_devolvidos', { entregues, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages });
        });
    });
})

app.post('/alocacao', isAuthenticated, (req, res) => {
    const { professor, sala, numero_projetor, caixa } = req.body
    const caixaValue = caixa === '' ? null : caixa
    const now = new Date()
    const data_alocacao = now.toISOString().split('T')[0]
    const hora_alocacao = now.toTimeString().split(' ')[0]

    // Check if professor already has an active allocation
    db.get('SELECT COUNT(*) as count FROM alocacao WHERE professor = ? AND status = "alocado"', [professor], (err, result) => {
        if (err) throw err
        if (result.count > 0) {
            // Fetch data to render form with error
            db.all('SELECT * FROM projetores', (err, projetores) => {
                if (err) throw err
                db.all('SELECT * FROM caixa_de_som', (err, caixas) => {
                    if (err) throw err
                    db.all('SELECT * FROM professores', (err, professores) => {
                        if (err) throw err
                        res.render('home', { projetores, caixas, professores, error: 'Professor já possui uma alocação ativa.' })
                    })
                })
            })
            return
        }

        // Check if projector is already allocated
        db.get('SELECT COUNT(*) as count FROM alocacao WHERE numero_projetor = ? AND status = "alocado"', [numero_projetor], (err, result) => {
            if (err) throw err
            if (result.count > 0) {
                db.all('SELECT * FROM projetores', (err, projetores) => {
                    if (err) throw err
                    db.all('SELECT * FROM caixa_de_som', (err, caixas) => {
                        if (err) throw err
                        db.all('SELECT * FROM professores', (err, professores) => {
                            if (err) throw err
                            res.render('home', { projetores, caixas, professores, error: 'Projetor já está alocado.' })
                        })
                    })
                })
                return
            }
            // Check if sound box is already allocated, if selected
            if (caixaValue) {
                db.get('SELECT COUNT(*) as count FROM alocacao WHERE caixa = ? AND status = "alocado"', [caixaValue], (err, result) => {
                    if (err) throw err
                    if (result.count > 0) {
                        db.all('SELECT * FROM projetores', (err, projetores) => {
                            if (err) throw err
                            db.all('SELECT * FROM caixa_de_som', (err, caixas) => {
                                if (err) throw err
                                db.all('SELECT * FROM professores', (err, professores) => {
                                    if (err) throw err
                                    res.render('home', { projetores, caixas, professores, error: 'Caixa de som já está alocada.' })
                                })
                            })
                        })
                        return
                    }
                    // All checks passed, insert
                    const query = 'INSERT INTO alocacao (professor, sala, numero_projetor, caixa, data_alocacao, hora_alocacao) VALUES (?, ?, ?, ?, ?, ?)'
                    db.run(query, [professor, sala, numero_projetor, caixaValue, data_alocacao, hora_alocacao], (err) => {
                        if (err) throw err
                        res.redirect('/alocacao')
                    })
                })
            } else {
                // No sound box, insert
                const query = 'INSERT INTO alocacao (professor, sala, numero_projetor, caixa, data_alocacao, hora_alocacao) VALUES (?, ?, ?, ?, ?, ?)'
                db.run(query, [professor, sala, numero_projetor, caixaValue, data_alocacao, hora_alocacao], (err) => {
                    if (err) throw err
                    req.session.success = 'Alocação realizada com sucesso!'
                    res.redirect('/alocacoes')
                })
            }
        })
    })
})

app.get('/alocacao/:id/edit', isAuthenticated, (req, res) => {
    const { id } = req.params
    // Buscar alocacao
    db.get('SELECT * FROM alocacao WHERE id = ?', [id], (err, alocacao) => {
        if (err) throw err
        if (!alocacao) {
            return res.redirect('/alocacoes')
        }
        // Buscar projetores
        db.all('SELECT * FROM projetores', (err, projetores) => {
            if (err) throw err
            // Buscar caixas de som
            db.all('SELECT * FROM caixa_de_som', (err, caixas) => {
                if (err) throw err
                // Buscar professores
                db.all('SELECT * FROM professores', (err, professores) => {
                    if (err) throw err
                    res.render('alocacao_edit', { alocacao, projetores, caixas, professores, error: null })
                })
            })
        })
    })
})

app.post('/alocacao/:id/edit', isAuthenticated, (req, res) => {
    const { id } = req.params
    const { professor, sala, numero_projetor, caixa } = req.body
    const caixaValue = caixa === '' ? null : caixa

    // Get current allocation
    db.get('SELECT * FROM alocacao WHERE id = ?', [id], (err, current) => {
        if (err) throw err
        if (!current) return res.redirect('/alocacoes')

        // Check if professor changed and if new professor has active allocation
        if (professor !== current.professor) {
            db.get('SELECT COUNT(*) as count FROM alocacao WHERE professor = ? AND status = "alocado" AND id != ?', [professor, id], (err, result) => {
                if (err) throw err
                if (result.count > 0) {
                    db.all('SELECT * FROM projetores', (err, projetores) => {
                        if (err) throw err
                        db.all('SELECT * FROM caixa_de_som', (err, caixas) => {
                            if (err) throw err
                            db.all('SELECT * FROM professores', (err, professores) => {
                                if (err) throw err
                                res.render('alocacao_edit', { alocacao: current, projetores, caixas, professores, error: 'Professor já possui uma alocação ativa.' })
                            })
                        })
                    })
                    return
                }
                checkProjector()
            })
        } else {
            checkProjector()
        }

        function checkProjector() {
            if (numero_projetor !== current.numero_projetor) {
                db.get('SELECT COUNT(*) as count FROM alocacao WHERE numero_projetor = ? AND status = "alocado" AND id != ?', [numero_projetor, id], (err, result) => {
                    if (err) throw err
                    if (result.count > 0) {
                        db.all('SELECT * FROM projetores', (err, projetores) => {
                            if (err) throw err
                            db.all('SELECT * FROM caixa_de_som', (err, caixas) => {
                                if (err) throw err
                                db.all('SELECT * FROM professores', (err, professores) => {
                                    if (err) throw err
                                    res.render('alocacao_edit', { alocacao: current, projetores, caixas, professores, error: 'Projetor já está alocado.' })
                                })
                            })
                        })
                        return
                    }
                    checkCaixa()
                })
            } else {
                checkCaixa()
            }
        }

        function checkCaixa() {
            if (caixaValue !== current.caixa) {
                if (caixaValue) {
                    db.get('SELECT COUNT(*) as count FROM alocacao WHERE caixa = ? AND status = "alocado" AND id != ?', [caixaValue, id], (err, result) => {
                        if (err) throw err
                        if (result.count > 0) {
                            db.all('SELECT * FROM projetores', (err, projetores) => {
                                if (err) throw err
                                db.all('SELECT * FROM caixa_de_som', (err, caixas) => {
                                    if (err) throw err
                                    db.all('SELECT * FROM professores', (err, professores) => {
                                        if (err) throw err
                                        res.render('alocacao_edit', { alocacao: current, projetores, caixas, professores, error: 'Caixa de som já está alocada.' })
                                    })
                                })
                            })
                            return
                        }
                        update()
                    })
                } else {
                    update()
                }
            } else {
                update()
            }
        }

        function update() {
            const query = 'UPDATE alocacao SET professor = ?, sala = ?, numero_projetor = ?, caixa = ? WHERE id = ?'
            db.run(query, [professor, sala, numero_projetor, caixaValue, id], (err) => {
                if (err) throw err
                res.redirect('/alocacoes')
            })
        }
    })
})

app.post('/alocacao/:id/delete', isAuthenticated, (req, res) => {
    const { id } = req.params
    const query = 'DELETE FROM alocacao WHERE id = ?'
    db.run(query, [id], (err) => {
        if (err) throw err
        res.redirect('/alocacoes')
    })
})

app.post('/alocacao/:id/entregue', isAuthenticated, (req, res) => {
    const { id } = req.params
    const query = 'UPDATE alocacao SET status = "entregue" WHERE id = ?'
    db.run(query, [id], (err) => {
        if (err) throw err
        res.redirect('/alocacoes')
    })
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err)
            res.redirect('/alocacao')
        } else {
            res.redirect('/')
        }
    })
})

app.listen(3000, (req,res) => {
    console.log('Servidor rodando na porta 3000')
})
