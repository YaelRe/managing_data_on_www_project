from telegram.ext import Updater, CallbackContext, CommandHandler, MessageHandler, Filters,  PollAnswerHandler
from telegram import Update, ReplyKeyboardRemove
import requests


MAX_USER_NAME_LENGTH = 30
TOKEN = '5015705357:AAGVtnC3_R809aHQLoRGWGAs8DA0iOle1n0'


def send_message_to_bot(context, chat_id, message):
    context.bot.send_message(chat_id=chat_id, text=message)


def start(update: Update, context: CallbackContext):
    options = '/register <user-name> - Register to start answering polls via telegram\n\n' \
        'user-name should be a single word, symbols are allowed and should be no longer than 30\n\n' \
        '/remove <user-name> To stop getting polls queries \n\n' \
        '/start Use the start command anytime to see this menu again'
    chat_id = update.effective_chat.id
    user_telegram_name = update.effective_user.name
    send_message_to_bot(context, chat_id, f"Hello {user_telegram_name}!")
    send_message_to_bot(context, chat_id, "Welcome to Polls Manager \n Please select one of the options below:")
    send_message_to_bot(context, chat_id, options)


def register(update: Update, context: CallbackContext):
    chat_id = update.effective_chat.id
    if len(context.args) == 0:
        send_message_to_bot(context, chat_id, "ERROR: no user name entered \n please try again to register")
    elif len(context.args) > 1:
        send_message_to_bot(context, chat_id, "ERROR: user name isn't valid - user name should be a single word \n please try again to register")
    else:
        user_name = str(context.args[0])
        if len(user_name) > MAX_USER_NAME_LENGTH:
            send_message_to_bot(context, chat_id, f"ERROR: user-name could not be longer than {MAX_USER_NAME_LENGTH}")
            return
        url = f'http://127.0.0.1:5000/register-user/'
        data = {'user_id': chat_id,'user_name' : user_name} 
        server_response = requests.post(url=url, data=data)
        if server_response.status_code == 200:
            send_message_to_bot(context, chat_id, f"{user_name} was registered successfuly!")
        elif server_response.status_code == 403:
            user_telegram_name = update.effective_user.name
            send_message_to_bot(context, chat_id, f"ERROR: Hi {user_telegram_name}! you have already registered \n you can remove your user with /remove command and try again")
        else:
            send_message_to_bot(context, chat_id, f"ERROR: register {user_name} failed due to internal error")


def remove(update: Update, context: CallbackContext):
    chat_id = update.effective_chat.id
    if len(context.args) == 0:
        send_message_to_bot(context, chat_id, "ERROR: no user name entered \n please try again to remove user")
    elif len(context.args) > 1:
        send_message_to_bot(context, chat_id, "ERROR: user name isn't valid - user name should be a single word \n please try again to remove user")
    else:
        user_name = str(context.args[0])
        chat_id = update.effective_chat.id
        url = f'http://127.0.0.1:5000/remove-user/'
        data = {'user_id': chat_id, 'user_name': user_name}
        server_response = requests.delete(url=url, data=data)
        if server_response.status_code == 200:
            send_message_to_bot(context, chat_id, f"{user_name} was removed successfuly!")
        elif server_response.status_code == 403:
            user_telegram_name = update.effective_user.name
            send_message_to_bot(context, chat_id, f"ERROR: Hi {user_telegram_name}! you didn't register a user with the name {user_name}")
        else:
            send_message_to_bot(context, chat_id, f"ERROR: remove {user_name} failed due to internal error")


def no_command(update: Update, context: CallbackContext):
    chat_id = update.effective_chat.id
    send_message_to_bot(context, chat_id, "ERROR: sorry, I didn't understand this command. \n For a list of supported commands please use /start command")


def unknown_command(update: Update, context: CallbackContext):
    chat_id = update.effective_chat.id
    send_message_to_bot(context, chat_id, "ERROR: sorry, I didn't understand this command. \n For a list of supported commands please use /start command")


def receive_poll_answer(update: Update, context: CallbackContext) -> None:
    answer = update.poll_answer
    answer_index = answer.option_ids[0] 
    poll_id = answer.poll_id
    chat_id = answer.user.id
    url = f'http://127.0.0.1:5000/bot/get-poll-answer/'
    data = {'user_id': chat_id, 'poll_bot_id': poll_id, 'answer_index': answer_index}
    server_response = requests.post(url=url, data=data)
    if server_response.status_code != 200:
        send_message_to_bot(context, chat_id, f"ERROR: send poll answer failed due to internal error")
  

def init_bot():
    updater = Updater(token=TOKEN, use_context=True)
    dispatcher = updater.dispatcher
    start_handler = CommandHandler('start', start, run_async=True)
    dispatcher.add_handler(start_handler)

    register_handler = CommandHandler('register', register, run_async=True)
    dispatcher.add_handler(register_handler)

    remove_handler = CommandHandler('remove', remove, run_async=True)
    dispatcher.add_handler(remove_handler)

    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, no_command, run_async=True))

    dispatcher.add_handler(MessageHandler(Filters.command, unknown_command, run_async=True))

    dispatcher.add_handler(PollAnswerHandler(receive_poll_answer))

    updater.start_polling()
