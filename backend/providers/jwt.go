package providers

import (
	"os"
	rt "pixclone-backend/runtime"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func GenerateJwtToken(id *uuid.UUID, username *string) (string, error) {
	signingKey := []byte(os.Getenv("SECRET_KEY"))

	type CustomClaims struct {
		UserID   string `json:"uid"`
		Username string `json:"usn"`
		jwt.RegisteredClaims
	}

	claims := CustomClaims{
		id.String(),
		*username,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 60)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS512, claims)
	tokenSigned, err := token.SignedString(signingKey)

	if err != nil {
		rt.Logger.Error("Fail signing token", zap.Error(err))
		return "", err
	}

	return tokenSigned, nil
}
