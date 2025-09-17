package main

import (
	"database/sql"
	"fmt"
	"os"

	// "github.com/lib/pq"
	"log"
)

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

var db *sql.DB

func initDB() {
	var err error
	host := getEnv("DB_HOST", "")
	name := getEnv("DB_NAME", "")
	user := getEnv("DB_USER", "")
	password := getEnv("DB_PASSWORD", "")
	port := getEnv("DB_PORT", "")

	conSt := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, name)
	//fmt.Println(conSt)
	db, err = sql.Open("postgres", conSt)
	if err != nil {
		log.Fatal("Your mama is gay")
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Your papa is gay")
	}
	log.Println("Your mama and papa are not gay")
}
func main() {
	initDB()
}
