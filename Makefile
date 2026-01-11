PHONY: up shell test

up:
	docker compose up

shell:
	docker compose exec -it astro sh

test:
	docker compose exec -it astro yarn run test