TOP_DIR=.
README=$(TOP_DIR)/README.md

VERSION=$(strip $(shell cat version))

build:
	@echo "Building the software..."
	@pnpm build

init: install
	@echo "Initializing the repo..."

install:
	@echo "Install software required for this repo..."
	@pnpm install

test:
	@echo "Running test suites..."
	@pnpm test

run:
	@echo "Running the software..."
	@pnpm dev

include .makefiles/*.mk

.PHONY: build init install test run bump-version
