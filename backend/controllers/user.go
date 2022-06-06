package controllers

import (
	"net/http"
	"pixclone-backend/helpers"
	"pixclone-backend/models"
	"pixclone-backend/providers"
	rt "pixclone-backend/runtime"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

// Inputs
type SignInUserInput struct {
	Username string `json:"username" binding:"required,min=4"`
	Password string `json:"password" binding:"required,min=4"`
}

type SignUpUserInput struct {
	Username    string `json:"username" binding:"required,min=4"`
	Password    string `json:"password" binding:"required,min=4"`
	DisplayName string `json:"display_name" binding:"required,min=4"`
}

// Responses
type SignInUserResponse struct {
	Token string `json:"token"`
}

type GetUserDataResponse struct {
	ID          uuid.UUID `json:"id"`
	DisplayName string    `json:"display_name"`
	Balance     float64   `json:"balance"`
}

// Router Methods
func SignInUser(c *gin.Context) {

	// Parse the user input
	var input SignInUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		rt.Logger.Error("Bad signin input...", zap.Error(err))
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Get user by his username
	user, err := models.GetUserByUsername(&input.Username)

	// Username doesn't exist
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusNotFound,
			helpers.ResponseError{Message: "Usuario ou senha incorretos...."},
		)
		return
	}

	// Compare input password with the user password
	err = bcrypt.CompareHashAndPassword(user.Password, []byte(input.Password))

	// Incorrect password
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusNotFound,
			helpers.ResponseError{Message: "Usuario ou senha incorretos...."},
		)
		return
	}

	// Generate JWT token
	tokenSigned, err := providers.GenerateJwtToken(&user.ID, &user.Username)

	// Fail to generate JWT token
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	// Send token to the user
	c.JSON(
		http.StatusOK,
		helpers.Response{
			Message: "Success signin",
			Data:    SignInUserResponse{Token: tokenSigned},
		},
	)
}

func SignUpUser(c *gin.Context) {

	// Parse the user input
	var input SignUpUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		rt.Logger.Error("Bad signup input", zap.Error(err))
		c.AbortWithStatus(http.StatusBadRequest)
	}

	// Hash the user password to store on db
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		rt.Logger.Error("Hash password failed...", zap.Error(err))
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	// Insert the user data on db, each user starts with a balance of 8000.00
	newUser := models.User{
		ID:          uuid.Must(uuid.NewRandom()),
		Username:    input.Username,
		Password:    hashedPassword,
		DisplayName: input.DisplayName,
		Balance:     8000.0,
	}
	err = models.CreateUser(&newUser)

	// Insert user on db failed
	if err != nil {
		rt.Logger.Error("Error trying insert user on db, maybe already exists...", zap.Error(err))
		c.AbortWithStatusJSON(
			http.StatusUnauthorized,
			helpers.ResponseError{Message: "Nome de usuario já existente..."},
		)
		return
	}

	rt.Logger.Info("User registered successfully...", zap.String("user", newUser.DisplayName))

	// Send success signup response to the user
	c.JSON(
		http.StatusOK,
		helpers.Response{Message: "Registrado com sucesso..."},
	)
}

func GetUserData(c *gin.Context) {

	// Get jwt claims user ID passed to the gin context
	userID, err := uuid.Parse(c.Param("uid"))

	// User ID is not a valid uuid
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Get user data on db by his ID
	userData, err := models.GetUserPrivateDataByID(&userID)

	// User with ID provided doesn't exist
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Send user private data to the user
	c.JSON(http.StatusOK, helpers.Response{Data: userData})
}
