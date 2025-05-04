.PHONY: serve
serve:
	npm run dev

.PHONY: docker-up
docker-up:
	docker-compose up

.PHONY: prisma-generate
prisma-generate:
	npm run prisma generate

.PHONY: upgrade-db
upgrade-db:
	npm run prisma migrate dev

.PHONY: build
build:
	npm run build

