package db

import (
	"arcade-k43/ak43/console"
	"database/sql"
	"hash/fnv"
	"time"
)

type Migration struct {
	version string
	comment string
	query   string
	hash    uint32
	date    time.Time
}

const createTableMigrationQuery = `
   CREATE TABLE IF NOT EXISTS migration (
      id       INT NOT NULL AUTO_INCREMENT,
      version  VARCHAR(32),
      comment  TEXT,
      hash     INT UNSIGNED,
      date     DATETIME,
      PRIMARY KEY (id, version)
   );
`

func scanMigration(rows *sql.Rows) (int, *Migration) {
	var id = int(0)
	var mig = Migration{}
	var dateText = ""
	err := rows.Scan(&id, &mig.version, &mig.comment, &mig.hash, &dateText)
	if err != nil {
		console.PanicF("can not read row of migration: ", err.Error())
	}
	date, err := time.Parse("2006-01-02 15:04:05", dateText)
	if err != nil {
		console.PanicF("error parsing time from db: ", err.Error())
	}
	mig.date = date
	return id, &mig
}

type MigrationDao interface {
	CreateTable()
	Add(migration *Migration)
	All() map[string]*Migration
}

type migrationDao struct {
	db *sql.DB
}

func NewMigrationDao(db *sql.DB) MigrationDao {
	m := migrationDao{}
	m.db = db
	return &m
}

func (m *migrationDao) Add(mig *Migration) {
	const insertMigrationQuery = `INSERT INTO migration (version, comment, hash, date) VALUES (?,?,?,?)`
	rows, err := m.db.Query(insertMigrationQuery, mig.version, mig.comment, mig.hash, time.Now())
	if err != nil {
		console.Panic("can not insert migration: " + err.Error())
	}
	defer rows.Close()
}

func (m *migrationDao) CreateTable() {
	rows, err := m.db.Query(createTableMigrationQuery)
	if err != nil {
		console.PanicF("can not create table migration: %s", err.Error())
	} else {
		console.Info("table migration exists")
	}
	defer rows.Close()
}

func (m *migrationDao) All() map[string]*Migration {
	migrations := make(map[string]*Migration)
	query := `SELECT * FROM migration ORDER BY ID ASC;`
	rows, err := m.db.Query(query)
	if err != nil {
		console.PanicF("can not read table migration: %s", err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		_, mig := scanMigration(rows)
		console.InfoF("migration present %s - %s - %s - %d", mig.version, mig.date, mig.comment, mig.hash)
		migrations[mig.version] = mig
	}

	return migrations
}

func SetMigrationHash(mig *Migration) {
   text := mig.version + "-" + mig.query;
	h := fnv.New32a()
	h.Write([]byte(text))
	mig.hash = h.Sum32()
}
