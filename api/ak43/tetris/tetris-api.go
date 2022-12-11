package tetris

import (
	"arcade-k43/ak43"
	"arcade-k43/ak43/console"
	"database/sql"
	"net/http"
)

type TetrisApi interface {
	GetHighscore(w http.ResponseWriter)
	PostHighscore(w http.ResponseWriter, r *http.Request)
}

type tetrisApi struct {
	ctx ak43.ApiContext
}

func NewTetrisApi(ctx ak43.ApiContext) TetrisApi {
	t := tetrisApi{
		ctx: ctx,
	}

	ak43.HandleFunc("/api/v1/tetris/highscore", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			t.GetHighscore(w)
		case "POST":
			t.PostHighscore(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	return &t
}

func (m *tetrisApi) GetHighscore(w http.ResponseWriter) {
	m.ctx.UseDB(w, func(db *sql.DB) {
		dao := NewHighscoreDao(db)
		highscore, err := dao.GetTop10()
		if err != nil {
			console.Info(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		ak43.WriteJson(w, highscore)
	})
}

func (m *tetrisApi) PostHighscore(w http.ResponseWriter, r *http.Request) {
	highscore := []Highscore{}
	if ak43.ReadJson(w, r, &highscore) {
		m.ctx.UseDB(w, func(db *sql.DB) {

			dao := NewHighscoreDao(db)
			err := dao.SetTop10(highscore)
			if err != nil {
				console.Info(err.Error())
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
		})
	}

}
