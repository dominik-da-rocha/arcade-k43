package main

import (
	"arcade-k43/api"
	"arcade-k43/utils"
	"fmt"
	"log"
	"net/http"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)
	empty := "                                                                   "
	fmt.Println()
	fmt.Println("▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄▄   ▄▄▄▄▄▄  ▄▄▄▄▄▄▄    ▄   ▄▄▄ ▄▄▄▄▄▄▄ ")
	fmt.Println("█      █       █      █   ▄  █ █      ██       █  █ █ █   █       █")
	fmt.Println("█  ▄   █       █  ▄   █  █ █ █ █  ▄    █    ▄▄▄█  █ █▄█   █▄▄▄    █")
	fmt.Println("█ █▄█  █     ▄▄█ █▄█  █   █▄▄█▄█ █ █   █   █▄▄▄   █       █▄▄▄█   █")
	fmt.Println("█      █    █  █      █    ▄▄  █ █▄█   █    ▄▄▄█  █▄▄▄    █▄▄▄    █")
	fmt.Println("█  ▄   █    █▄▄█  ▄   █   █  █ █       █   █▄▄▄       █   █▄▄▄█   █")
	fmt.Println("█▄█ █▄▄█▄▄▄▄▄▄▄█▄█ █▄▄█▄▄▄█  █▄█▄▄▄▄▄▄██▄▄▄▄▄▄▄█      █▄▄▄█▄▄▄▄▄▄▄█")
	fmt.Println(utils.AlignRight(empty, Version))
	fmt.Println(empty)
	http.HandleFunc("/api/v1", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "{\"version\": \""+Version+"\"}")
	})
	api.StartHttp()
}
