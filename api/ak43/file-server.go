package ak43

import (
	"arcade-k43/ak43/console"
	"fmt"
	"net/http"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

type Ak43Server interface {
	Start() error
}

type ak43Server struct {
	ctx ApiContext
}

func NewAk43Server(ctx ApiContext) Ak43Server {
	new := ak43Server{
		ctx: ctx,
	}
	return &new
}

func (m *ak43Server) Start() error {
	config := LoadApiConfigFromArgs()

	HandleFunc("/api/v1", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "{\"version\": \""+Version+"\"}")
	})

	console.Info("setting up file server: " + config.Html)
	fileServer := http.FileServer(http.Dir(config.Html))
	Handle("/", http.StripPrefix("/", fileServer))

	port := ":" + strconv.Itoa(config.ListenPort)
	console.Info("listen on port: " + port)
	err := http.ListenAndServe(port, nil)
	return err
}
