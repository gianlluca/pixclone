package models

import (
	rt "pixclone-backend/runtime"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Table Transactions
type Transaction struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey"`
	SenderID   uuid.UUID `gorm:"type:uuid"`
	Sender     User      ``
	ReceiverID uuid.UUID `gorm:"type:uuid"`
	Receiver   User      ``
	Value      float64   `gorm:"type:double precision;index"`
	CreatedAt  time.Time `gorm:"index"`
}

type TransactionPublicData struct {
	ID         uuid.UUID      `json:"id"`
	SenderID   uuid.UUID      `json:"sender_id"` // Necessary to make join operation
	Sender     UserPublicData `json:"sender"`
	ReceiverID uuid.UUID      `json:"receiver_id"` // Necessary to make join operation
	Receiver   UserPublicData `json:"receiver"`
	Value      float64        `json:"value"`
	CreatedAt  time.Time      `json:"created_at"`
}

// Fetch transaction from db by transaction ID
func GetTransactionByID(transactionID *uuid.UUID) (*Transaction, error) {
	var transaction *Transaction
	result := rt.DB.Where("id = ?", *transactionID).First(&transaction)
	return transaction, result.Error
}

// Fetch transaction public data from db by transaction ID
func GetTransactionPublicDataByID(transactionID *uuid.UUID) (*TransactionPublicData, error) {
	var transactionPublicData *TransactionPublicData
	result := rt.DB.
		Model(&Transaction{}).
		Joins("Sender").
		Joins("Receiver").
		Where("transactions.id = ?", *transactionID).
		Find(&transactionPublicData)
	return transactionPublicData, result.Error
}

// Fetch all user transactions public data from db by user ID
func GetTransactionsPublicDataByUserID(userID *uuid.UUID) (*[]TransactionPublicData, error) {
	var transactionPublicData *[]TransactionPublicData
	result := rt.DB.
		Model(&Transaction{}).
		Joins("Sender").
		Joins("Receiver").
		Where("sender_id = ? OR receiver_id = ?", *userID, *userID).
		Find(&transactionPublicData)
	return transactionPublicData, result.Error
}

// Create a user transaction on db using a `db transaction` passing the user transaction itself
func CreateTransaction(transaction *Transaction) (*TransactionPublicData, error) {

	// create transaction
	errTx := rt.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&transaction).Error; err != nil {
			// return any error will rollback
			return err
		}

		// subtracts the transaction value to the balance of the user who send it
		if err := tx.Model(&User{}).Where("id = ?", transaction.SenderID).UpdateColumn("balance", gorm.Expr("balance - ?", transaction.Value)).Error; err != nil {
			// return any error will rollback
			return err
		}

		// adds the transaction value to the balance of the user who receive it
		if err := tx.Model(&User{}).Where("id = ?", transaction.ReceiverID).UpdateColumn("balance", gorm.Expr("balance + ?", transaction.Value)).Error; err != nil {
			// return any error will rollback
			return err
		}

		// return nil will commit the whole transaction
		return nil
	})

	// Error making transation
	if errTx != nil {
		return nil, errTx
	}

	// Fetch the transaction created to return to the user
	transactionPublicData, err := GetTransactionPublicDataByID(&transaction.ID)

	// Error fetching transaction created
	if err != nil {
		return nil, err
	}

	return transactionPublicData, nil
}
