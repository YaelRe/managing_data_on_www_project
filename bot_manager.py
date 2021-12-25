from telegram.ext import Updater
from telegram import Update
from telegram.ext import CallbackContext
from telegram.ext import CommandHandler
import requests

# import logging

#TODO: check if there is an option to print errors in the Telgram-bot in red

TOKEN = '5015705357:AAGVtnC3_R809aHQLoRGWGAs8DA0iOle1n0'
updater = Updater(token=TOKEN, use_context=True)
dispatcher = updater.dispatcher
# logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#                      level=logging.INFO)

def start(update: Update, context: CallbackContext):
    options = '/register <user-name> - Register to start answering polls via telegram \n\n ' \
        'user-name should be a single word, symbols are allowed' \
        '/remove <user-name> To stop getting polls queries \n\n' \
        '/start Use the start command anytime to see this menu again'
    context.bot.send_message(chat_id=update.effective_chat.id, text="Hello user!")
    context.bot.send_message(chat_id=update.effective_chat.id, text="Welcome to Polls Manager \n Please select one of the options below:")
    context.bot.send_message(chat_id=update.effective_chat.id, text=options)

def register(update: Update, context: CallbackContext):
    if (len(context.args) == 0):
        context.bot.send_message(chat_id=update.effective_chat.id, text="ERROR: no user name entered \n please try again to register")
    elif (len(context.args) > 1):
        context.bot.send_message(chat_id=update.effective_chat.id, text="ERROR: user name isn't valid - user name should be a single word \n please try again to register")
    else:
        user_name = str(context.args[0])
        # TODO: handle username too long (according to database constraints)(right now the length is 80)
        url = f'http://127.0.0.1:5000/register-user/{user_name}'
        data = {'user_name' : user_name} # TODO: check how to send request without duplicated data
        server_response = requests.post(url=url, data=data)
        if server_response.status_code == 200:
             context.bot.send_message(chat_id=update.effective_chat.id, text=f"{user_name} was registered successfuly!")
        elif server_response.status_code == 403:
            context.bot.send_message(chat_id=update.effective_chat.id, text=f"ERROR: user-name {user_name} already exists \n please try again to register")
        else:
            context.bot.send_message(chat_id=update.effective_chat.id, text=f"ERROR: register {user_name} failed due to internal error")

def remove(update: Update, context: CallbackContext):
    if (len(context.args) == 0):
        context.bot.send_message(chat_id=update.effective_chat.id, text="ERROR: no user name entered \n please try again to remove user")
    elif (len(context.args) > 1):
        context.bot.send_message(chat_id=update.effective_chat.id, text="ERROR: user name isn't valid - user name should be a single word \n please try again to remove user")
    else:
        user_name = str(context.args[0])
        url = f'http://127.0.0.1:5000/remove-user/{user_name}'
        data = {'user_name' : user_name} # TODO: check how to send request without duplicated data
        server_response = requests.delete(url=url, data=data)
        if server_response.status_code == 200:
             context.bot.send_message(chat_id=update.effective_chat.id, text=f"{user_name} was removed successfuly!")
        elif server_response.status_code == 403:
            context.bot.send_message(chat_id=update.effective_chat.id, text=f"ERROR: user-name {user_name} doesn't exists")
        else:
            context.bot.send_message(chat_id=update.effective_chat.id, text=f"ERROR: remove {user_name} failed due to internal error")

start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)

register_handler = CommandHandler('register', register)
dispatcher.add_handler(register_handler)

remove_handler = CommandHandler('remove', remove)
dispatcher.add_handler(remove_handler)

# TODO: handle case of not valid command (/blabla)

updater.start_polling()
