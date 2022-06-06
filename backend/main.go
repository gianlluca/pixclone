package main

import (
	"fmt"
	"log"
	"pixclone-backend/models"
	"pixclone-backend/router"
	rt "pixclone-backend/runtime"

	"go.uber.org/zap"
)

// DEV
func main() {

	const (
		HTTP_PORT = ":5858"
	)

	// Initialize zap logger
	if err := rt.InitializeRuntimeLogger(); err != nil {
		log.Fatal("Error initializing logger...")
	}
	// Initialize database connection
	if err := rt.InitializeRuntimeDatabase(); err != nil {
		log.Fatal("Error initializing database...")
	}
	// Auto Migrate with models
	err := rt.DB.AutoMigrate(&models.User{}, &models.Transaction{}, &models.Charge{})
	if err != nil {
		log.Fatal(err)
	}

	// Initialize router
	httpRouter := router.InitializeRouter()

	// Run http router
	err = httpRouter.Run(HTTP_PORT)
	if err != nil {
		rt.Logger.Error(fmt.Sprintf("Coudn't listen on port %s", HTTP_PORT), zap.Error(err))
	}

	fmt.Println("Finished")
}

// PRODUCTION
// func main() {

// 	const (
// 		DOMAIN     = "https://exampledomain.com/"
// 		HTTP_PORT  = ":80"
// 		HTTPS_PORT = ":443"
// 	)

// 	// Initialize zap logger
// 	if err := rt.InitializeRuntimeLogger(); err != nil {
// 		log.Fatal("Error initializing logger...")
// 	}
// 	// Initialize database connection
// 	if err := rt.InitializeRuntimeDatabase(); err != nil {
// 		log.Fatal("Error initializing database...")
// 	}

// 	// Auto Migrate with models
// 	err := rt.DB.AutoMigrate(&models.User{}, &models.Transaction{}, &models.Charge{})
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	// Setup HTTP server to redirect all HTTP requests to HTTPS
// 	httpRouter := gin.Default()
// 	httpRouter.GET("/*path", func(c *gin.Context) {
// 		c.Redirect(302, DOMAIN+c.Param("variable"))
// 	})

// 	// Setup HTTPS server
// 	httpsRouter := router.InitializeRouter()

// 	// Run HTTPS SERVER
// 	go httpsRouter.RunTLS(HTTPS_PORT, "CERT_PATH", "KEY_PATH")

// 	// Run HTTP server
// 	err = httpRouter.Run(HTTP_PORT)
// 	if err != nil {
// 		rt.Logger.Error(fmt.Sprintf("Coudn't listen on port %s", HTTP_PORT), zap.Error(err))
// 	}

// 	fmt.Println("Finished")
// }
