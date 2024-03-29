RELEASE_VERSION=v$(VERSION)
GIT_BRANCH=$(strip $(shell git symbolic-ref --short HEAD))
GIT_VERSION="$(strip $(shell git rev-parse --short HEAD))"

release:
	@git config --local user.name "bot"
	@git config --local user.email "bot@arcblock.io"
	@git tag -a $(RELEASE_VERSION) -m "Release $(RELEASE_VERSION). Revision is: $(GIT_VERSION)" | true
	@git push origin $(RELEASE_VERSION) | true

delete-release:
	@echo "Delete a release on $(RELEASE_VERSION)"
	@git tag -d $(RELEASE_VERSION) | true
	@git push -f -d origin $(RELEASE_VERSION) | true

bump-version:
	@echo "Bump version..."
	@.makefiles/bump_version.sh
	@test -f "package.json" && .makefiles/bump_node_version.sh
