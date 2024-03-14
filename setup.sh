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

TYPEORM_SCHEMA=url_shortener_schema
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=postgres
TYPEORM_DATABASE=url_shortener
TYPEORM_TEST_DATABASE=url_shortener_test
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=true
TYPEORM_AUTOLOAD=true
END