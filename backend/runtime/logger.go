package rt

import (
	"fmt"

	"go.uber.org/zap"
)

var Logger *zap.Logger

func InitializeRuntimeLogger() error {
	var err error
	Logger, err = zap.NewProduction()
	if err != nil {
		return err
	}

	fmt.Println("Runtime Zap Logger Initialized")
	return nil
}
