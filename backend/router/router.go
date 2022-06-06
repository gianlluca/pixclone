package router

import (
	"net/http"
	controllers "pixclone-backend/controllers"
	middlewares "pixclone-backend/middlewares"
	rt "pixclone-backend/runtime"

	"github.com/gin-gonic/gin"
)

func InitializeRouter() *gin.Engine {

	// Initialize gin
	app := gin.Default()
	app.Use(middlewares.CORS)

	// AUTH PATH
	auth := app.Group("/auth")
	auth.POST("/signIn", controllers.SignInUser)
	auth.POST("/signUp", controllers.SignUpUser)

	// USER PATH
	user := app.Group("/user")
	user.Use(middlewares.CheckJwtAuth) // Use middleware to have access on this path only with token
	user.GET("", controllers.GetUserData)

	// // TRANSACTIONS PATH
	transactions := app.Group("/transactions")
	transactions.Use(middlewares.CheckJwtAuth) // Use middleware to have access on this path only with token
	transactions.GET("/all", controllers.GetAllTransactionsPublicData)
	transactions.POST("/new", controllers.CreateTransaction)

	// CHARGES PATH
	charges := app.Group("/charges")
	charges.Use(middlewares.CheckJwtAuth) // Use middleware to have access on this path only with token
	charges.GET("/all", controllers.GetAllChargesPublicData)
	charges.POST("/new", controllers.CreateCharge)
	charges.POST("/pay", controllers.PayCharge)

	// PATH NOT FOUND
	app.NoRoute(func(c *gin.Context) { c.String(http.StatusNotFound, "404 not found") })

	rt.Logger.Info("Router completed...")
	return app
}
