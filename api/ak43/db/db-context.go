package db

import (
	"arcade-k43/ak43/console"
	"database/sql"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type DbConfig struct {
	Driver   string `json:"driver"`
	Database string `json:"database"`
	Port     int    `json:"port"`
	Host     string `json:"host"`
	User     string `json:"user"`
}

func NewDbConfig() *DbConfig {
	return &DbConfig{
		Driver:   "mysql",
		Database: "ak43_db",
		Port:     3306,
		Host:     "localhost",
		User:     "ak43_user",
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

func (m *dbContext) Init(config *DbConfig) error {
	m.dbConfig = config

	db, err := m.DB()
	if err != nil {
		console.Panic("can not open database! " + err.Error())
	}
	defer db.Close()
	m.callMigrationScripts(db)
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
		password := os.Getenv("AK43_DB_PASSWORD")
		if password == "" {
			console.Panic("no environment AK43_DB_PASSWORD provided")
		}
		return sql.Open(config.Driver, c1+password+c2)
	} else {
		console.PanicF("Unknown driver %s", config.Driver)
	}

	return nil, nil
}

func (m *dbContext) callMigrationScripts(db *sql.DB) {
	dao := NewMigrationDao(db)
	dao.CreateTable()
	oldMigrations := dao.All()
	for _, mig := range migrations {
		SetMigrationHash(mig)
		if oldMig, found := oldMigrations[mig.version]; !found {
			if m.runMigration(db, mig) {
				mig.date = time.Now()
				dao.Add(mig)
				console.Info("migration successful: " + mig.version + " " + mig.comment)
			}
		} else if mig.hash != oldMig.hash {
			console.Info("migration hash is invalid: " + mig.version + " " + mig.comment)
		}
	}
}

func (m *dbContext) runMigration(db *sql.DB, mig *Migration) bool {
	rows, err := db.Query(string(mig.query))
	if err != nil {
		console.Panic("Failed to query migration " + err.Error())
	}
	defer rows.Close()
	return true
}

var migrations = []*Migration{
	{
		version: "v0.0",
		comment: "create table tetris_highscore",
		query: `CREATE TABLE IF NOT EXISTS ak43_db.tetris_highscore (
               id INT NOT NULL AUTO_INCREMENT,
               name VARCHAR(64) NOT NULL,
               score INT NOT NULL,
               PRIMARY KEY (id)
            );`,
	},
	{
		version: "v0.1",
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
