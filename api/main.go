package main

import (
	"arcade-k43/ak43"
	"arcade-k43/ak43/console"
	"arcade-k43/ak43/tetris"
	"fmt"
)

func main() {
	empty := "                                                                          "
	fmt.Println()
	fmt.Println(" ▄▄▄▄▄▄ ▄▄▄▄▄▄   ▄▄▄▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄▄  ▄▄▄▄▄▄▄    ▄▄▄   ▄ ▄   ▄▄▄ ▄▄▄▄▄▄▄ ")
	fmt.Println("█      █   ▄  █ █       █      █      ██       █  █   █ █ █ █ █   █       █")
	fmt.Println("█  ▄   █  █ █ █ █       █  ▄   █  ▄    █    ▄▄▄█  █   █▄█ █ █▄█   █▄▄▄    █")
	fmt.Println("█ █▄█  █   █▄▄█▄█     ▄▄█ █▄█  █ █ █   █   █▄▄▄   █      ▄█       █▄▄▄█   █")
	fmt.Println("█      █    ▄▄  █    █  █      █ █▄█   █    ▄▄▄█  █     █▄█▄▄▄    █▄▄▄    █")
	fmt.Println("█  ▄   █   █  █ █    █▄▄█  ▄   █       █   █▄▄▄   █    ▄  █   █   █▄▄▄█   █")
	fmt.Println("█▄█ █▄▄█▄▄▄█  █▄█▄▄▄▄▄▄▄█▄█ █▄▄█▄▄▄▄▄▄██▄▄▄▄▄▄▄█  █▄▄▄█ █▄█   █▄▄▄█▄▄▄▄▄▄▄█")
	fmt.Println(ak43.AlignRight(empty, ak43.Version))
	fmt.Println(empty)
	ctx := ak43.NewApiContext()
	_ = tetris.NewTetrisApi(ctx)
	server := ak43.NewAk43Server(ctx)
	err := server.Start()
	if err != nil {
		console.Panic(err.Error())
	}
}
