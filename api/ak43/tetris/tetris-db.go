package tetris

import (
	"arcade-k43/ak43/console"
	"database/sql"
)


type Highscore struct {
	Id    int    `json:"id"`
	Score int    `json:"score"`
	Name  string `json:"name"`
}

type HighscoreDao interface {
	GetTop10() ([]Highscore, error)
	SetTop10([]Highscore) error
}

type highscoreDao struct {
	db  *sql.DB
	tab string
}

func NewHighscoreDao(db *sql.DB) HighscoreDao {
	return &highscoreDao{
		db:  db,
		tab: "tetris_highscore",
	}
}

func (m *highscoreDao) GetTop10() ([]Highscore, error) {

	query := "SELECT * FROM " + m.tab + " ORDER BY ? DESC LIMIT ?"
	rows, err := m.db.Query(query, "score", 10)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	highscore := []Highscore{}
	for rows.Next() {
		var entry Highscore
		err := rows.Scan(&entry.Id, &entry.Name, &entry.Score)
		if err != nil {
			return nil, err
		} else {
			highscore = append(highscore, entry)
		}
	}
	return highscore, nil
}

func (m *highscoreDao) SetTop10(entries []Highscore) error {

	if len(entries) <= 0 {
		return nil
	}
	numOfFields := 2
	query := "INSERT INTO " + m.tab + " (name, score) VALUES"
	args := make([]interface{}, len(entries)*numOfFields)

	m.db.Begin()

	for i, entry := range entries {
		if i != 0 {
			query += ","
		}
		query += "(?,?)"
		pos := i * numOfFields
		args[pos+0] = entry.Name
		args[pos+1] = entry.Score
		pos += 2
	}
	_, err := m.db.Query(query, args...)
	console.InfoF("inserted %d into ak43_db.tetris_highscore", len(entries))
	return err

}

/*
var queryString = `INSERT INTO "person_table" (
        "name"
        , "age"
        , "job"
    ) VALUES `

    numOfFields := 3
    params := make([]interface{}, len(personSlice)*numOfFields)
    for i, p := range personSlice {
        pos := i * numOfFields
        params[pos+0] = p.Name
        params[pos+1] = p.Age
        params[pos+2] = p.Job

        queryString += `(?, ?, ?),`
    }

    queryString = queryString[:len(queryString)-1] // drop last comma

    _, err := db.Exec(queryString, params...)
    return err
*/
