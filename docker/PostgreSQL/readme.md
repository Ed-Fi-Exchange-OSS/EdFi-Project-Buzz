This Docker compose file assumes use of Linux-based containers.

It maps the standard PostgreSQL port 5432 for access by the localhost, with user
"postgres" and password "pa55w0rd". It also creates a volume for the database files.

* Container name: `edfi-buzz-pg`
* Volume name: `edfi-buzz-pg-data`
* Database name: `EdFi_Buzz`

Windows users: setup file sharing before starting the container, as there is a script in this directory that needs to run inside the container.

1. Open Docker Desktop
2. Click on Resources
3. Click on File Sharing
4. Add the directory containing this file
5. click on Apply & Restart

Start PostgreSQL with command `docker-compose up -d`. `-d` is optional for
running the container in the background instead of hijacking your console).
