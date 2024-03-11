#!/bin/sh
echo "Creating test .env file ..."
tee -a .env << END
SERVICE_NAME="URL Shortener"

API_PORT=3080
API_PREFIX=api

API_SWAGGER_DOC="url-shortener-doc"
API_SWAGGER_TITLE='URL Shortener Service'
API_SWAGGER_DESCRIPTION='URL Shortener Service'
API_SWAGGER_VERSION='1.0'

END