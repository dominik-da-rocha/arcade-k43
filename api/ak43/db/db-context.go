package db

import (
	"arcade-k43/ak43/console"
	"database/sql"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

type DbConfig struct {
	Driver   string `json:"driver"`
	Database string `json:"database"`
	Port     int    `json:"port"`
	Host     string `json:"host"`
	User     string `json:"user"`
	Password string `json:"password"`
}

func NewDbConfig() *DbConfig {
	return &DbConfig{
		Driver:   "mysql",
		Database: "ak43_db",
		Port:     3306,
		Host:     "localhost",
		User:     "ak43_user",
		Password: "1234",
	}
}

type DbContext interface {
	Init(config *DbConfig) error
	DB() (*sql.DB, error)
}

type dbContext struct {
	dbConfig *DbConfig
}

func NewDbContext() DbContext {
	context := dbContext{}
	return &context
}

type migration struct {
	comment string
	query   string
}

func (m *dbContext) Init(config *DbConfig) error {
	m.dbConfig = config

	db, err := m.DB()
	if err != nil {
		console.Panic("can not open database! " + err.Error())
	}
	defer db.Close()
	m.createTableMigration(db)
	oldMigrations := m.selectOldMigrations(db)
	m.callMigrationScripts(db, oldMigrations)
	return nil
}

func (m *dbContext) DB() (*sql.DB, error) {
	return m.openDbFromConfig(m.dbConfig)
}

func (m *dbContext) openDbFromConfig(config *DbConfig) (*sql.DB, error) {
	if config.Driver == "mysql" {
		c1 := config.User + ":"
		c2 := "@tcp(" + config.Host + ":" + strconv.Itoa(config.Port) + ")/" + config.Database
		console.Info("Connecting to database: " + c1 + "****" + c2)
		return sql.Open(config.Driver, c1+config.Password+c2)
	} else if config.Driver == "sqlite3" {
		console.Info("Connecting to database: " + config.Database)
		return sql.Open(config.Driver, config.Database)
	} else {
		console.PanicF("Unknown driver %s", config.Driver)
	}

	return nil, nil
}

func (m *dbContext) createTableMigration(db *sql.DB) {
	query := "CREATE TABLE IF NOT EXISTS migration (" +
		"id INT NOT NULL," +
		"comment VARCHAR(64)," +
		"PRIMARY KEY (id))"
	rows, err := db.Query(query)
	if err != nil {
		console.Panic("can not create table migration: " + err.Error())
	}
	defer rows.Close()
	console.Info("table migration exists")
}

func (m *dbContext) insertMigration(db *sql.DB, id int, mig *migration) bool {
	query := "INSERT INTO migration (id, comment) VALUES (" +
		strconv.Itoa(id) + ",'" + mig.comment + "');"
	rows, err := db.Query(query)
	if err != nil {
		console.Panic("can not create table migration: " + err.Error())
	}
	defer rows.Close()
	return true
}

func (m *dbContext) selectOldMigrations(db *sql.DB) map[int]*migration {
	oldMigrations := map[int]*migration{}
	query := "SELECT * FROM migration;"
	rows, err := db.Query(query)
	if err != nil {
		console.Panic("can not read migrations: " + err.Error())
	}
	defer rows.Close()
	for rows.Next() {
		var mig migration
		var id int
		err = rows.Scan(&id, &mig.comment)
		if err != nil {
			console.Info(err.Error())
		} else {
			console.Info("migration present " + strconv.Itoa(id) + " " + mig.comment)
			oldMigrations[id] = &mig
		}
	}

	return oldMigrations
}

func (m *dbContext) callMigrationScripts(db *sql.DB, oldMigrations map[int]*migration) {
	for id, mig := range migrations {
		if _, found := oldMigrations[id]; !found {
			if m.runMigration(db, mig) {
				if m.insertMigration(db, id, mig) {
					console.Info("migration successful: " + strconv.Itoa(id) + " " + mig.comment)
				}
			}
		}
	}
}

func (m *dbContext) runMigration(db *sql.DB, mig *migration) bool {
	rows, err := db.Query(string(mig.query))
	if err != nil {
		console.Panic("Failed to query migration " + err.Error())
	}
	defer rows.Close()
	return true
}

var migrations = []*migration{
	{
		comment: "create table tetris_highscore",
		query: `CREATE TABLE IF NOT EXISTS ak43_db.tetris_highscore (
               id INT NOT NULL AUTO_INCREMENT,
               name VARCHAR(64) NOT NULL,
               score INT NOT NULL,
               PRIMARY KEY (id)
            );`,
	},
	{
		comment: "fill table tetris_highscore",
		query: `INSERT INTO ak43_db.tetris_highscore (name, score) 
               VALUES ('xxx', 0),
                  ('xxx', 0),
                  ('xxx', 0),
                  ('xxx', 0),
                  ('xxx', 0),
                  ('xxx', 0),
                  ('xxx', 0),
                  ('xxx', 0),
                  ('xxx', 0);`,
	},
}
