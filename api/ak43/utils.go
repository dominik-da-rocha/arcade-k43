package ak43

import (
	"arcade-k43/ak43/console"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func AlignRight(empty string, Version string) string {
	lenMax := len(empty)
	lenVer := len(Version)
	rest := lenMax - lenVer + 1
	return empty[1:rest] + Version
}

func WriteJson(w http.ResponseWriter, data interface{}) {
	body, err := json.Marshal(data)
	if err != nil {
		console.Info("error: parsing json " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")
	w.Write(body)
}

func ReadJson(w http.ResponseWriter, r *http.Request, out interface{}) bool {
	bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			console.ErrorF(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			return false
		}
		
		err = json.Unmarshal(bodyBytes, out)
      if err != nil {
			console.ErrorF(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			return false
		}		
      return true
}


