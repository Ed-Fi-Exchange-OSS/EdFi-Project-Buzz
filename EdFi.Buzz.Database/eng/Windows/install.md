# Install Instructions for the Buzz Database

## Pre-Requisites

* A PostgreSQL database. Tested on version 11, although likely to work on other
  versions as well.
* Node.js. Tested on version 12.13.0.

## Configuration

You will need to provide the following parameters

* Host name (default: `localhost`)
* Port number (default: 5432)
* Database name (default: `edfi_buzz`)
* User name (default: `postgres`)
* Password (no default value)

## Run

Accept all defaults:

```powershell
.\install.ps1 -DbPassword "myPassword"
```

Fully customized:

```powershell
$params = @{
    DbServer = "myPostgresHost"
    DbPort = 5430
    DbUserName = "super"
    DbPassword = "myPassword"
    DbName = "edfi_buzz"
}
.\install.ps1 @params
```
