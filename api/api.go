package api

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
)

type Config struct {
	Port int    `json:"port"`
	Html string `json:"html"`
}

func defaultConfig() Config {
	return Config{
		Port: 8080,
		Html: "./html",
	}
}

func LoadConfig(file string) Config {
	log.Println("reading config file: " + file)
	content, err := os.ReadFile(file)
	if err != nil {
		log.Println("failed to read file")
		return defaultConfig()
	}

	var config Config
	err = json.Unmarshal(content, &config)
	if err != nil {
		log.Panicln("failed to parse config file")
	}

	return config
}

func LoadConfigFromArgs() Config {
	configFile := "./config/config.json"
	if len(os.Args) > 1 {
		configFile = os.Args[1]
	}
	return LoadConfig(configFile)
}

func StartHttp() {
	config := LoadConfigFromArgs()

	log.Println("setting up file server: ", config.Html)
	fileServer := http.FileServer(http.Dir(config.Html))
	http.Handle("/", http.StripPrefix("/", fileServer))

	port := ":" + strconv.Itoa(config.Port)
	log.Println("listen on port: " + port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Panicln(err)
	}
}
