include .env
export $(shell sed 's/=.*//' .env)

deploy-dev:
	docker-compose \
		-f docker-compose.yml \
    up \
    -d --build

logs-dev:
	docker-compose \
		-f docker-compose.yml \
    logs -f --tail=0

stop-dev:
	docker-compose \
		-f docker-compose.yml \
    stop 

deploy:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.production.yml \
		--tlsverify \
    --tlscacert=${HOME}/.docker/${SERVER}/ca.pem \
    --tlscert=${HOME}/.docker/${SERVER}/cert.pem \
    --tlskey=${HOME}/.docker/${SERVER}/key.pem \
    -H=${SERVER}:2376 \
    up \
    -d --build

logs:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.production.yml \
		--tlsverify \
		--tlscacert=${HOME}/.docker/${SERVER}/ca.pem \
		--tlscert=${HOME}/.docker/${SERVER}/cert.pem \
		--tlskey=${HOME}/.docker/${SERVER}/key.pem \
    -H=${SERVER}:2376 \
    logs -f --tail=0

dev: deploy-dev logs-dev

prod: deploy logs
