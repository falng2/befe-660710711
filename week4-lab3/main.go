package main

import (
	"errors"
	"fmt"
)

type Student struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Email string  `json:"email"`
	Year  int     `json:"year"`
	GPA   float64 `json:"gpa"`
}

func (s *Student) IsHonor() bool {
	return s.GPA >= 3.50
}

func (s *Student) Validate() error {
	if s.Name == "" {
		return errors.New("name is required")
	}
	if s.Year < 1 || s.Year > 4 {
		return errors.New("year must be between 1-4")
	}
	if s.GPA < 0 || s.GPA > 4 {
		return errors.New("gpa must be between 0-4")
	}
	return nil
}

func main() {
	// var st Student = Student{ID: "1", Name: "Thanaset", Email: "gg.gmail@sola", Year: 4, GPA: 3.99}s

	students := []Student{
		{ID: "1", Name: "Thanaset", Email: "gg.gmail@sola", Year: 4, GPA: 3.49},
		{ID: "2", Name: "Fla", Email: "Burn@gmail.world", Year: 8, GPA: 69.420},
	}

	newStudent := Student{ID: "3", Name: "Eray", Email: "FFS.gmailWWsola", Year: 4, GPA: 4.00}
	students = append(students, newStudent)

	for i, student := range students {
		fmt.Printf("%d ", i)
		fmt.Printf("Hornor %v\n", student.IsHonor())
		fmt.Printf("Validation %v\n", student.Validate())
	}
}
