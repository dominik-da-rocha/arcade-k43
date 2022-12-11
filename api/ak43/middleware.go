package ak43

import (
	"arcade-k43/ak43/console"
	"net/http"
)

type middleware struct {
	handler http.Handler
}

func (m *middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	console.InfoF("%s %s", r.Method, r.URL.String())
	m.handler.ServeHTTP(w, r)
}

func Handle(pattern string, handler http.Handler) {
	m := middleware{
		handler: handler,
	}
	http.Handle(pattern, &m)
}

func HandleFunc(pattern string, handler func(http.ResponseWriter, *http.Request)) {
	Handle(pattern, http.HandlerFunc(handler))
}
