package main

import (
	"database/sql"
	
	"github.com/gin-gonic/gin"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type Employee struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Grade          string `json:"grade"`
	Pay            int    `json:"pay"`
	PhoneNumber    string `json:"phoneNumber"`
	Gender         string `json:"gender"`
	Birthday       string `json:"birthday"`
	EmploymentDate string `json:"employmentDate"`
	Address        string `json:"address"`
	Image          []byte `json:"image"`
}

type Country struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Continent       string `json:"continent"`
	LeadershipName  string `json:"leadershipName"`
	AffairsName     string `json:"affairsName"`
	ContactName     string `json:"contactName"`
	Population      string `json:"population"`
	TerritorialArea string `json:"territorialArea"`
	Contact         string `json:"contact"`
	IsDiploma       bool   `json:"isDiploma"`
}

type Draft struct {
	ID                string `json:"id"`
	DraftedCountryID  string `json:"draftedCountryId"`
	Name              string `json:"name"`
	EmploymentDate    string `json:"employmentDate"`
	Nickname          string `json:"nickname"`
}

type Relative struct {
	ID             string `json:"id"`
	RelativeID     string `json:"relativeId"`
	RelativeName   string `json:"relativeName"`
	RelativeGender string `json:"relativeGender"`
	Relationship   string `json:"relationship"`
}

var db *sql.DB

func init() {
	var err error
	db, err = sql.Open("mysql", "admin:J;3ej032k7todolist@tcp(localhost:3306)/draftDB")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
}

// CORS Middleware
func setCORSHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.JSON(http.StatusOK, nil)
			return
		}
		c.Next()
	}
}

func createEmployee(c *gin.Context) {
	var emp Employee
	if err := c.ShouldBindJSON(&emp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	query := `INSERT INTO employees (id, name, grade, pay, phoneNumber, gender, birthday, employmentDate, address, image, status) 
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := db.Exec(query, emp.ID, emp.Name, emp.Grade, emp.Pay, emp.PhoneNumber, emp.Gender, emp.Birthday, emp.EmploymentDate, emp.Address, emp.Image, "normal")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create employee"})
		return
	}

	c.Status(http.StatusCreated)
}

func updateEmployee(c *gin.Context) {
	var emp Employee
	if err := c.ShouldBindJSON(&emp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	query := `UPDATE employees SET name = ?, grade = ?, pay = ?, phoneNumber = ?, address = ? WHERE id = ?`
	_, err := db.Exec(query, emp.Name, emp.Grade, emp.Pay, emp.PhoneNumber, emp.Address, emp.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee"})
		return
	}

	c.Status(http.StatusOK)
}

func deleteEmployee(c *gin.Context) {
	id := c.DefaultQuery("id", "")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Employee ID is required"})
		return
	}

	query := `UPDATE employees SET status = 'deleted' WHERE id = ?`
	_, err := db.Exec(query, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee"})
		return
	}

	c.Status(http.StatusOK)
}

func getEmployees(c *gin.Context) {
	// 查詢所有員工資料
	query := `SELECT id, name, grade, pay, phoneNumber, gender, birthday, employmentDate, address, image FROM employees`
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch employees"})
		return
	}
	defer rows.Close()

	var employees []Employee
	// 循環遍歷所有結果
	for rows.Next() {
		var emp Employee
		if err := rows.Scan(&emp.ID, &emp.Name, &emp.Grade, &emp.Pay, &emp.PhoneNumber, &emp.Gender, &emp.Birthday, &emp.EmploymentDate, &emp.Address, &emp.Image); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan employee data"})
			return
		}
		employees = append(employees, emp)
	}

	// 檢查是否有查詢錯誤
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read employee data"})
		return
	}

	// 返回員工資料
	c.JSON(http.StatusOK, employees)
}


func createCountry(c *gin.Context) {
	var country Country
	if err := c.ShouldBindJSON(&country); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	query := `INSERT INTO country (id, name, continent, leadershipName, affairsName, contactName, population, territorialArea, contact, is_diploma) 
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := db.Exec(query, country.ID, country.Name, country.Continent, country.LeadershipName, country.AffairsName, country.ContactName, country.Population, country.TerritorialArea, country.Contact, country.IsDiploma)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create country"})
		return
	}

	c.Status(http.StatusCreated)
}

func main() {
	r := gin.Default()

	// Apply CORS middleware globally
	r.Use(setCORSHeaders())

	r.POST("/employees/create", createEmployee)
	r.PUT("/employees/update", updateEmployee)
	r.DELETE("/employees/delete", deleteEmployee)
	r.GET("/employees/get", getEmployees)
	r.POST("/countries/create", createCountry)

	log.Println("Server is running on port 9998...")
	r.Run(":9998")
}
