# Poll Manager App

This project is a platform for sending polls through Telegram Bot (@PollsManager2022Bot)

## How to run our project

In the main directory you'll find the following files-
* package.json - contains all dependencies needed for React 
* environment.yml - contains all dependencies needed for flask Server (note: we used .venv and not conda)
* run_project.py - a script for running the app 
* config.py - contains configuration variables including :
    * boot_key
    * server_port
    * initial_admin_name 
    * initial_password 
    * db_connection string
* src directory contains all the needed files for the React part

### `run_project.py`
Runs all parts of the project (flask server, React and bot).\
Make sure you installed all needed dependencies listed in the both package.json and
environment.yml files before running the project.

The DB is also initialized using run project.
It creates empty tables with registering admin with:
* user name- 'admin' 
* password- '236369'.   

Note: for multiple runs please comment out the command db.drop_all() in function run_project() in app.py file.

![Alt text](demo_images/PollsResults.JPG?raw=true)
![Alt text](demo_images/createFilteredPoll.JPG?raw=true)
![Alt text](demo_images/TelegramBot.JPG?raw=true)

