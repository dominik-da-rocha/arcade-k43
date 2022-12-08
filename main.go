package main

import (
	"fmt"
);

func main() {
   empty:= "                                                                   ";
   fmt.Println()
   fmt.Println("▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄▄   ▄▄▄▄▄▄  ▄▄▄▄▄▄▄    ▄   ▄▄▄ ▄▄▄▄▄▄▄ ");
   fmt.Println("█      █       █      █   ▄  █ █      ██       █  █ █ █   █       █");
   fmt.Println("█  ▄   █       █  ▄   █  █ █ █ █  ▄    █    ▄▄▄█  █ █▄█   █▄▄▄    █");
   fmt.Println("█ █▄█  █     ▄▄█ █▄█  █   █▄▄█▄█ █ █   █   █▄▄▄   █       █▄▄▄█   █");
   fmt.Println("█      █    █  █      █    ▄▄  █ █▄█   █    ▄▄▄█  █▄▄▄    █▄▄▄    █");
   fmt.Println("█  ▄   █    █▄▄█  ▄   █   █  █ █       █   █▄▄▄       █   █▄▄▄█   █");
   fmt.Println("█▄█ █▄▄█▄▄▄▄▄▄▄█▄█ █▄▄█▄▄▄█  █▄█▄▄▄▄▄▄██▄▄▄▄▄▄▄█      █▄▄▄█▄▄▄▄▄▄▄█");
   fmt.Println(alignRight(empty,Version));
   fmt.Println(empty);
}

func alignRight(empty string, Version string) string {
	lmax := len(empty);
   lver := len(Version)
   rest := lmax - lver +1;
   return empty[1:rest] + Version;
}

