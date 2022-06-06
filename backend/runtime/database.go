package rt

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitializeRuntimeDatabase() error {

	// Db connection parameters
	var (
		DB_HOST = "pixclone_db"
		DB_USER = "admin"
		DB_PASS = "password123"
		DB_DB   = "pixclone"
		DB_PORT = 5432
	)

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable",
		DB_HOST, DB_USER, DB_PASS, DB_DB, DB_PORT,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{SkipDefaultTransaction: true})
	if err != nil {
		return err
	}

	fmt.Println("Runtime Database Initialized")
	return nil
}
