// main.go
package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Student struct
type Student struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Year int    `json:"year"`
	Gun  string `json:"gun"`
}

type Gem struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Amount   int     `json:"amount"`
	Price    int     `json:"price"`
	Hardness float64 `json:"hard"`
}

// In-memory database (ในโปรเจคจริงใช้ database)
var students = []Student{
	{ID: "1", Name: "Yurizono Seia", Year: 3, Gun: "HG"},
	{ID: "2", Name: "Takanashi Hoshino", Year: 3, Gun: "SG"},
	{ID: "3", Name: "Sorasaki Hina", Year: 3, Gun: "MG"},
	{ID: "4", Name: "Ryuuge Kisaki", Year: 3, Gun: "SMG"},
	{ID: "5", Name: "Iochi Mari", Year: 1, Gun: "HG"},
	{ID: "6", Name: "Kurimura Airi", Year: 1, Gun: "SMG"},
	{ID: "7", Name: "Saiba Midori", Year: 1, Gun: "SR"},
	{ID: "8", Name: "Sumi Serina", Year: 2, Gun: "AR"},
	{ID: "9", Name: "Amau Ako", Year: 2, Gun: "HG"},
	{ID: "10", Name: "Hayase Yuuka", Year: 2, Gun: "SMG"},
}

var gems = []Gem{
	{ID: "1", Name: "Ruby", Amount: 420, Price: 12345, Hardness: 9},
	{ID: "2", Name: "Cuprite", Amount: 69, Price: 15234, Hardness: 3.5},
	{ID: "3", Name: "Lazurite", Amount: 141, Price: 12543, Hardness: 4.5},
	{ID: "4", Name: "Emerald", Amount: 14, Price: 21354, Hardness: 8},
	{ID: "5", Name: "Diamond", Amount: 21, Price: 32145, Hardness: 10},
	{ID: "6", Name: "Aquamarine", Amount: 20, Price: 12543, Hardness: 7.5},
	{ID: "7", Name: "Jade", Amount: 89, Price: 11223, Hardness: 7},
	{ID: "8", Name: "Rhodonite", Amount: 67, Price: 21235, Hardness: 6.5},
	{ID: "9", Name: "Fluorite", Amount: 56, Price: 21235, Hardness: 5},
	{ID: "10", Name: "Quartz", Amount: 31, Price: 12345, Hardness: 7},
}

func getGems(c *gin.Context) {
	hardQuery := c.Query("hard")

	if hardQuery != "" {
		filter1 := []Gem{}
		for _, gem := range gems {
			if fmt.Sprint(gem.Hardness) == hardQuery {
				filter1 = append(filter1, gem)
			}
		}
		c.JSON(http.StatusOK, filter1)
		return
	}
	c.JSON(http.StatusOK, gems)
}

func getStudents(c *gin.Context) {
	yearQuery := c.Query("year")

	if yearQuery != "" {
		filter := []Student{}
		for _, student := range students {
			if fmt.Sprint(student.Year) == yearQuery {
				filter = append(filter, student)
			}
		}
		c.JSON(http.StatusOK, filter)
		return
	}
	c.JSON(http.StatusOK, students)
}

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Gemstones & Students"})
	})

	api := r.Group("/api/v1")
	{
		api.GET("/students", getStudents)
		api.GET("/gems", getGems)
	}

	r.Run(":8080")
}
