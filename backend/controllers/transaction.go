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
type CreateTransactionInput struct {
	Username string  `json:"username" binding:"required,min=4"`
	Value    float64 `json:"value" binding:"required,min=1"`
}

// Router Methods
func GetAllTransactionsPublicData(c *gin.Context) {

	// Get jwt claims user ID passed to the gin context
	userID, err := uuid.Parse(c.Param("uid"))

	// User ID is not a valid uuid
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	transactionsResponse, err := models.GetTransactionsPublicDataByUserID(&userID)

	// Error fetching transactions
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Return all user transactions public data to the user
	c.JSON(http.StatusOK, helpers.Response{Data: transactionsResponse})
}

func CreateTransaction(c *gin.Context) {

	// Get jwt claims user ID passed to the gin context
	userID, err := uuid.Parse(c.Param("uid"))

	// User ID is not a valid uuid
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Parse create transaction input
	var createTransactionInput CreateTransactionInput
	if err := c.ShouldBindJSON(&createTransactionInput); err != nil {
		rt.Logger.Error("Bad create transaction input...", zap.Error(err))
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Get sender user on db by his ID
	sender, err := models.GetUserByID(&userID)

	// User with ID provided doesn't exist
	if err != nil {
		rt.Logger.Error("User with ID provided doesn't exist", zap.Error(err))
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Transaction value bigger than sender balance
	if createTransactionInput.Value > sender.Balance {
		rt.Logger.Error("Transaction value bigger than sender balance",
			zap.Error(err), zap.Float64("sender_balance", sender.Balance), zap.Float64("transaction_value", createTransactionInput.Value))
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Get receiver user on db by his username
	receiver, err := models.GetUserByUsername(&createTransactionInput.Username)

	// User with username provided doesn't exist
	if err != nil {
		rt.Logger.Error("User with username provided doesn't exist", zap.Error(err))
		c.AbortWithStatusJSON(
			http.StatusNotFound,
			helpers.ResponseError{Message: "Usuario inexistente..."},
		)
		return
	}

	// User is trying to create a transaction to himself
	if sender.Username == receiver.Username {
		rt.Logger.Error("User is trying to create a transaction to himself", zap.Error(err))
		c.AbortWithStatusJSON(
			http.StatusMethodNotAllowed,
			helpers.ResponseError{Message: "Você não pode criar uma transação para si mesmo."},
		)
		return
	}

	// Create a transaction struct with the data
	transaction := models.Transaction{
		ID:         uuid.Must(uuid.NewRandom()),
		SenderID:   sender.ID,
		ReceiverID: receiver.ID,
		Value:      createTransactionInput.Value,
		CreatedAt:  time.Now().UTC(),
	}

	// Create transaction on db
	transactionResponse, err := models.CreateTransaction(&transaction)

	// Error creating transaction
	if err != nil {
		rt.Logger.Error("InternalServerError", zap.Error(err))
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	// Return the transaction created public data to the user
	c.JSON(http.StatusOK, helpers.Response{Data: transactionResponse})
}
