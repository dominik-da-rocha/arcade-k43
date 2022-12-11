package ak43

import (
	"arcade-k43/ak43/console"
	"arcade-k43/ak43/db"
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
)

type ApiContext interface {
	UseDB(w http.ResponseWriter, callback func(*sql.DB))
}

type ApiConfig struct {
	ListenPort int                    `json:"listenPort"`
	Html       string                 `json:"html"`
	Database   *db.DbConfig           `json:"database"`
	Logging    *console.LoggingConfig `json:"logging"`
}

func NewApiConfig() *ApiConfig {
	return &ApiConfig{
		ListenPort: 8080,
		Html:       "./html",
		Database:   db.NewDbConfig(),
		Logging:    console.NewLoggingConfig(),
	}
}

func LoadApiConfig(file string) *ApiConfig {
	console.Info("reading config file: " + file)
	content, err := os.ReadFile(file)
	if err != nil {
		console.Info("failed to read file")
		return NewApiConfig()
	}

	var config ApiConfig
	err = json.Unmarshal(content, &config)
	if err != nil {
		console.Panic("failed to parse config file")
	}
	return &config
}

func LoadApiConfigFromArgs() *ApiConfig {
	configFile := "./config/config.json"
	if len(os.Args) > 1 {
		configFile = os.Args[1]
	}
	return LoadApiConfig(configFile)
}

type apiContext struct {
	config ApiConfig
	db     db.DbContext
}

func NewApiContext() ApiContext {
	ctx := apiContext{
		config: *NewApiConfig(),
		db:     db.NewDbContext(),
	}
	console.Init(ctx.config.Logging)
	ctx.db.Init(ctx.config.Database)
	return &ctx
}

func (m *apiContext) UseDB(w http.ResponseWriter, callback func(*sql.DB)) {
	db, err := m.db.DB()
	if err != nil {
		console.Info("error: can not create database: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
	}
	defer db.Close()
	callback(db)
	return
}
