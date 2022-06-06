package models

import (
	rt "pixclone-backend/runtime"

	"github.com/google/uuid"
)

// Table Users
type User struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	Username    string    `gorm:"unique"`
	Password    []byte    ``
	DisplayName string    ``
	Balance     float64   `gorm:"type:double precision;index;check:balance >= 0"`
}

type UserPrivateData struct {
	ID          uuid.UUID `json:"id"`
	Username    string    `json:"username"`
	DisplayName string    `json:"display_name"`
	Balance     float64   `json:"balance"`
}

type UserPublicData struct {
	// ID is necessary to make join operations, set json "-" to
	// ignore field when converting struct to json
	ID          uuid.UUID `json:"-"`
	DisplayName string    `json:"display_name"`
}

// Fetch user from db by user ID
func GetUserByID(userID *uuid.UUID) (*User, error) {
	var user *User
	result := rt.DB.Where("id = ?", *userID).First(&user)
	return user, result.Error
}

// Fetch user from db by user username
func GetUserByUsername(username *string) (*User, error) {
	var user *User
	result := rt.DB.Where("username = ?", *username).First(&user)
	return user, result.Error
}

// Fetch user private data from db by user ID
func GetUserPrivateDataByID(userID *uuid.UUID) (*UserPrivateData, error) {
	var userPrivateData *UserPrivateData
	result := rt.DB.Model(&User{}).Where("id = ?", *userID).First(&userPrivateData)
	return userPrivateData, result.Error
}

// Fetch user public data from db by user ID
func GetUserPublicDataByID(userID *uuid.UUID) (*UserPublicData, error) {
	var userPublicData *UserPublicData
	result := rt.DB.Model(&User{}).Where("id = ?", *userID).First(&userPublicData)
	return userPublicData, result.Error
}

// Create user on db passing user itself
func CreateUser(user *User) error {
	result := rt.DB.Create(&user)
	return result.Error
}
