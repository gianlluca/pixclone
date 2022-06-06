package controllers

import (
	"net/http"
	"pixclone-backend/helpers"
	"pixclone-backend/models"
	rt "pixclone-backend/runtime"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// Inputs
type CreateChargeInput struct {
	Username string  `json:"username" binding:"required,min=4"`
	Value    float64 `json:"value" binding:"required,min=1"`
}

type PayChargeInput struct {
	ID string `json:"id" binding:"required,uuid4"`
}

// Router Methods
func GetAllChargesPublicData(c *gin.Context) {

	// Get jwt claims user ID passed to the gin context
	userID, err := uuid.Parse(c.Param("uid"))

	// User ID is not a valid uuid
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Fetch all user charges public data
	chargesResponse, err := models.GetChargesPublicDataByUserID(&userID)

	// Error fetching charges
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Return charges public data to the user
	c.JSON(http.StatusOK, helpers.Response{Data: chargesResponse})
}

func CreateCharge(c *gin.Context) {

	// Get jwt claims user ID passed to the gin context
	userID, err := uuid.Parse(c.Param("uid"))

	// User ID is not a valid uuid
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Parse create charge input
	var createChargeInput CreateChargeInput
	if err := c.ShouldBindJSON(&createChargeInput); err != nil {
		rt.Logger.Error("Bad create charge input...", zap.String("ErrorMessage", err.Error()))
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Get sender user on db by his ID
	sender, err := models.GetUserByID(&userID)

	// User with ID provided doesn't exist
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Get receiver user on db by his ID
	receiver, err := models.GetUserByUsername(&createChargeInput.Username)

	// User with username provided doesn't exist
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusNotFound,
			helpers.ResponseError{Message: "Usuario inexistente..."},
		)
		return
	}

	// User is trying to create a charge to himself
	if sender.Username == receiver.Username {
		rt.Logger.Error("User is trying to create a charge to himself", zap.Error(err))
		c.AbortWithStatusJSON(
			http.StatusMethodNotAllowed,
			helpers.ResponseError{Message: "Você não pode criar uma cobrança para si mesmo."},
		)
		return
	}

	// Create a charge struct with the data
	charge := models.Charge{
		ID:         uuid.Must(uuid.NewRandom()),
		SenderID:   sender.ID,
		ReceiverID: receiver.ID,
		Value:      createChargeInput.Value,
		Paid:       false,
		CreatedAt:  time.Now().UTC(),
	}

	// Insert charge on db
	chargeResponse, err := models.CreateCharge(&charge)

	// Error creating charge
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	c.JSON(http.StatusOK, helpers.Response{Data: chargeResponse})
}

func PayCharge(c *gin.Context) {

	// Get jwt claims user ID passed to the gin context
	userID, err := uuid.Parse(c.Param("uid"))

	// User ID is not a valid uuid
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Parse pay charge input
	var chargePayInput PayChargeInput
	if err := c.ShouldBindJSON(&chargePayInput); err != nil {
		rt.Logger.Error("Bad pay charge input...", zap.Error(err))
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Parse charge id from string to UUID
	chargeID, err := uuid.Parse(chargePayInput.ID)
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Get charge from db by ID
	charge, err := models.GetChargeByID(&chargeID)

	// charge with ID provided doesn't exist
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Trying to pay a charge that is already paid
	if charge.Paid {
		rt.Logger.Info("Charge is already paid")
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Get receiver user on db by his ID
	receiver, err := models.GetUserByID(&charge.ReceiverID)

	// User with ID provided doesn't exist
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// User is trying to pay a charge that was not for him
	if userID.String() != receiver.ID.String() {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// User dont have balance to pay this charge
	if charge.Value > receiver.Balance {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Pay charge on db
	chargeResponse, err := models.PayCharge(charge)

	// Error paying charge on db
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	// Return charge paid public data to the user
	c.JSON(http.StatusOK, helpers.Response{Data: chargeResponse})
}
