package utils

func AlignRight(empty string, Version string) string {
	lenMax := len(empty)
	lenVer := len(Version)
	rest := lenMax - lenVer + 1
	return empty[1:rest] + Version
}
