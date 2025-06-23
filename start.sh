#!/bin/bash

echo "Starting the application..."

if [ ! -f database/database.sqlite ]; then
    echo "Database file not found. Creating a new database..."
    touch database/database.sqlite
else
    echo "Database file found. Proceeding with the application..."
fi

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan serve --host=0.0.0.0 --port=8080