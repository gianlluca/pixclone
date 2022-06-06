package middlewares

import (
	"errors"
	"net/http"
	"os"
	"pixclone-backend/helpers"
	rt "pixclone-backend/runtime"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"go.uber.org/zap"
)

// Split the authorization header and return only the token
func extractJwtBearerToken(header string) (string, error) {

	if header == "" {
		return "", errors.New("bad header value given")
	}

	authHeader := strings.Split(header, " ")
	if len(authHeader) != 2 {
		return "", errors.New("incorrectly formatted authorization header")
	}

	return authHeader[1], nil
}

// Check if token is valid and not expired
func CheckJwtAuth(c *gin.Context) {
	signingKey := []byte(os.Getenv("SECRET_KEY"))

	// Extract token from Bearer header
	tokenString, err := extractJwtBearerToken(c.GetHeader("Authorization"))
	if err != nil {
		rt.Logger.Error("Error extracting token from Bearer header", zap.Error(err))
		c.AbortWithStatusJSON(http.StatusUnauthorized, helpers.ResponseError{Message: "Invalid token"})
		return
	}

	type CustomClaims struct {
		UserID   string `json:"uid"`
		Username string `json:"usn"`
		jwt.RegisteredClaims
	}

	// Parse token string to token
	token, err := jwt.ParseWithClaims(
		tokenString,
		&CustomClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return signingKey, nil
		},
	)

	// Invalid token
	if token == nil {
		rt.Logger.Info("Mal formed token")
		c.AbortWithStatusJSON(http.StatusBadRequest, helpers.ResponseError{Message: "Invalid token"})
		return
	}

	// Invalid token
	if !token.Valid {
		if errors.Is(err, jwt.ErrTokenMalformed) {
			// Token mal formed
			rt.Logger.Info("Mal formed token")
		} else if errors.Is(err, jwt.ErrTokenExpired) {
			// Token is expired
			rt.Logger.Info("Token is expired")
			c.AbortWithStatusJSON(http.StatusUnauthorized, helpers.ResponseError{Message: "Token is expired"})
			return
		} else {
			// Token unhandled error
			rt.Logger.Error("Token error", zap.Error(err))
		}
		c.AbortWithStatusJSON(http.StatusUnauthorized, helpers.ResponseError{Message: "Invalid token"})
		return
	}

	// Parse claims from token
	claims, ok := token.Claims.(*CustomClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, helpers.ResponseError{Message: "Invalid token"})
		return
	}

	// Set uid param to the next handler knows what user is calling
	c.Params = append(c.Params, gin.Param{Key: "uid", Value: claims.UserID})

	// Call next handler
	c.Next()
}
