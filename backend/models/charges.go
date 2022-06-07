package models

import (
	rt "pixclone-backend/runtime"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Table Charges
type Charge struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey"`
	SenderID   uuid.UUID `gorm:"type:uuid"`
	Sender     User      ``
	ReceiverID uuid.UUID `gorm:"type:uuid"`
	Receiver   User      ``
	Value      float64   `gorm:"type:double precision;index"`
	Paid       bool      ``
	CreatedAt  time.Time `gorm:"index"`
}

type ChargePublicData struct {
	ID         uuid.UUID      `json:"id"`
	SenderID   uuid.UUID      `json:"sender_id"` // Necessary to make join operation
	Sender     UserPublicData `json:"sender"`
	ReceiverID uuid.UUID      `json:"receiver_id"` // Necessary to make join operation
	Receiver   UserPublicData `json:"receiver"`
	Value      float64        `json:"value"`
	Paid       bool           `json:"paid"`
	CreatedAt  time.Time      `json:"created_at"`
}

// Fetch charge from db by charge ID
func GetChargeByID(chargeID *uuid.UUID) (*Charge, error) {
	var charge *Charge
	result := rt.DB.Where("id = ?", *chargeID).First(&charge)
	return charge, result.Error
}

// Fetch charge public data from db by charge ID
func GetChargePublicDataByID(chargeID *uuid.UUID) (*ChargePublicData, error) {
	var chargePublicData *ChargePublicData
	result := rt.DB.
		Model(&Charge{}).
		Joins("Sender").
		Joins("Receiver").
		Where("charges.id = ?", *chargeID).
		Find(&chargePublicData)
	return chargePublicData, result.Error
}

// Fetch all user charges public data from db by user ID
func GetChargesPublicDataByUserID(userID *uuid.UUID) (*[]ChargePublicData, error) {
	var chargesPublicData *[]ChargePublicData
	result := rt.DB.
		Model(&Charge{}).
		Joins("Sender").
		Joins("Receiver").
		Where("sender_id = ? OR receiver_id = ?", *userID, *userID).
		Order("created_at desc").
		Find(&chargesPublicData)
	return chargesPublicData, result.Error
}

// Create a charge on db passing the charge
func CreateCharge(charge *Charge) (*ChargePublicData, error) {
	result := rt.DB.Create(&charge)

	// Error creating charge
	if result.Error != nil {
		return nil, result.Error
	}

	// Fetch the charge created to return to the user
	chargePublicData, err := GetChargePublicDataByID(&charge.ID)

	// Error fetching charge created
	if err != nil {
		return nil, err
	}

	// Return charge created public data to the user
	return chargePublicData, nil
}

// Pay a user charge on db using a `db transaction` passing the user charge itself
func PayCharge(charge *Charge) (*ChargePublicData, error) {
	errTx := rt.DB.Transaction(func(tx *gorm.DB) error {
		// change the charge paid column to true
		if err := tx.Model(&charge).UpdateColumn("paid", true).Error; err != nil {
			// return any error will rollback
			return err
		}

		// subtracts the amount of the charge to the balance of the user who receive it
		if err := tx.Model(&User{}).Where("id = ?", charge.SenderID).UpdateColumn("balance", gorm.Expr("balance + ?", charge.Value)).Error; err != nil {
			// return any error will rollback
			return err
		}

		// adds the amount of the charge to the balance of the user who made it
		if err := tx.Model(&User{}).Where("id = ?", charge.ReceiverID).UpdateColumn("balance", gorm.Expr("balance - ?", charge.Value)).Error; err != nil {
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

	// Fetch the charge paid to return to the user
	chargePublicData, err := GetChargePublicDataByID(&charge.ID)

	// Error fetching charge paid
	if err != nil {
		return nil, err
	}

	// Return charge paid to the user the
	return chargePublicData, nil
}
