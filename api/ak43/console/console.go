package console

import (
	"fmt"
	"log"
	"os"
)

type LogCat int

const (
	LcTrace LogCat = iota + 1
	LcDebug
	LcInfo
	LcWarn
	LcError
	LcPanic
	LcAlways
)

func (s LogCat) String() string {
	logCats := [...]string{
		"trace",
		"debug",
		"info",
		"warn",
		"error",
		"panic",
		"always",
	}
	if s < LcTrace || s > LcAlways {
		return fmt.Sprintf("LogCat(%d)", int(s))
	}
	return logCats[s-1]
}

type LoggingConfig struct {
	Prefix string `json:"prefix"`
	LogCat string `json:"logCat"`
}

func NewLoggingConfig() *LoggingConfig {
	lc := LoggingConfig{
		Prefix: "ak43",
		LogCat: "debug",
	}
	return &lc
}

var logCat = LcDebug
var std = log.New(os.Stderr, "", log.LstdFlags)

func Init(config *LoggingConfig) {
	std.SetPrefix("[" + config.Prefix + "] ")
	logCat = ParseLogCat(config.LogCat)
	if logCat < LcInfo {
		std.SetFlags(log.Ldate | log.Ltime | log.LUTC | log.Lmicroseconds | log.Lshortfile)
	} else {
		std.SetFlags(log.Ldate | log.Ltime | log.LUTC)
	}
	AlwaysF("Setting LogCat to %s", logCat)
}

func ParseLogCat(s string) LogCat {
	return LcDebug
}

func Trace(args string) { std.Output(2, fmt.Sprintf("[%s] %s", LcTrace, args)) }
func Debug(args string) { std.Output(2, fmt.Sprintf("[%s] %s", LcDebug, args)) }
func Info(args string)  { std.Output(2, fmt.Sprintf("[%s] %s", LcInfo, args)) }
func Warn(args string)  { std.Output(2, fmt.Sprintf("[%s] %s", LcWarn, args)) }
func Error(args string) { std.Output(2, fmt.Sprintf("[%s] %s", LcError, args)) }
func Panic(args string) {
	s := fmt.Sprintf("[%s] %s", LcPanic, args)
	std.Output(2, s)
	panic(s)
}
func Always(args string) { std.Output(2, fmt.Sprintf("[%s] %s", LcAlways, args)) }

func TraceF(f string, args ...interface{}) { std.Output(2, fmt.Sprintf("[Trace] "+f, args...)) }
func DebugF(f string, args ...interface{}) { std.Output(2, fmt.Sprintf("[Debug] "+f, args...)) }
func InfoF(f string, args ...interface{})  { std.Output(2, fmt.Sprintf("[Info] "+f, args...)) }
func WarnF(f string, args ...interface{})  { std.Output(2, fmt.Sprintf("[Warn] "+f, args...)) }
func ErrorF(f string, args ...interface{}) { std.Output(2, fmt.Sprintf("[Error] "+f, args...)) }
func PanicF(f string, args ...interface{}) {
	s := fmt.Sprintf("[Panic] "+f, args)
	std.Output(2, s)
	panic(s)
}
func AlwaysF(f string, args ...interface{}) {
	std.Output(2, fmt.Sprintf("[Always] "+f, LcAlways, args))
}
