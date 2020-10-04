server="server-one.henaff.io"

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
    --tlscacert=${HOME}/.docker/${server}/ca.pem \
    --tlscert=${HOME}/.docker/${server}/cert.pem \
    --tlskey=${HOME}/.docker/${server}/key.pem \
    -H=${server}:2376 \
    up \
    -d --build

logs:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.production.yml \
		--tlsverify \
		--tlscacert=${HOME}/.docker/${server}/ca.pem \
		--tlscert=${HOME}/.docker/${server}/cert.pem \
		--tlskey=${HOME}/.docker/${server}/key.pem \
    -H=${server}:2376 \
    logs -f --tail=0

dev: deploy-dev logs-dev

prod: deploy logs
