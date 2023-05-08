# BCR - Car Management API 

Nama : Renaldy William Lijaya Therry <br>
Kelas : FSW-1

API untuk mengolah data mobil
terdapat 3 peran dalam api ini, yaitu : superadmin, admin, member.  


## Setup Server

    npm install

To install all dependencies needed to run this server.  
Next is to configure server settings. All settings are avaliable on `config` directories. All configuration files are listed below:

After configuration is done, run the following command to complete server setup with one command:

    npm run setup

If there is problem with the one-line command you can run this set of commands instead:

    sequelize db:drop
    sequelize db:create
    sequelize db:migrate
    sequelize db:seed:all

Rerun either of these commands to fresh reset the server database.

## Superadmin Account

Superadmin account can access all endpoint in the API and create more admin account. Default superadmin account are configured like this:

    name: Bokuto
    email: bokuto@superadmin.com
    password: bokuto12

To change the default account details, the configuration files are available on `config/superadmin.js`. To apply changes to superadmin account configuration, run the following one-line command:

    npm run superadmin

If there is problem with the one-line command you can run this set of commands instead:
    
    sequelize db:seed:undo
    sequelize db:seed:all



## Run Server

To run the server in normal mode, run the following command:

    npm start

To run the server in development mode, run the following command instead:

    npm run develop

Server will run at `http://localhost:8000` by default.

## API Documentation

| Documentation type | Link | Details |
|--|--|--|
| OpenAPI Swagger UI | http://localhost:8000 <br> http://localhost:8000/api-docs |

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| POST | [/register] | Register new member |
| POST | [/login] | Login with account |
| GET | [/whoami]| Get current user data |
| GET | [/users] | Get current registered users |
| POST | [/admins] | Add new admin |
| POST | [/images] | Upload image to server |
| GET | [/images/{imageId}] | Get image data by ID |
| DELETE | [/images/{imageId}] | Delete image from server by ID |
| GET | [/cars] | Get car list |
| POST | [/cars] | Add new car data |
| GET | [/cars/{carId}] | Get car data by ID |
| PUT | [/cars/{carId}]| Edit car data by ID |
| DELETE | [/cars/{carId}] | Delete car data by ID |
| GET | [/archive/cars] | Get archived car data list |
| GET | [/archive/cars/{carId}] | Get archived car data by ID |
| DELETE | [/archive/cars/{carId}] | Destroy archived car data by ID |
| GET | [/archive/cars/{carId}/restore] | Restore archived car data by ID |

## ERD

![erd image](/ERD.png)