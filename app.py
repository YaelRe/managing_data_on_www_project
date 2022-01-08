from flask import Flask, request, Response, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from sqlalchemy.sql import func
from telegram import Bot
from werkzeug.wrappers import response
from bot_manager import init_bot
from werkzeug.security import generate_password_hash, check_password_hash


# TODO: create config file
TOKEN = '5015705357:AAGVtnC3_R809aHQLoRGWGAs8DA0iOle1n0'
HTTP_CODES = {200: 'OK', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found',
           409: 'Conflict', 500: 'Internal Server Error', 501: 'Not Implemented'}

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
db = SQLAlchemy(app)
poll_id_mapper = {}


class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.BigInteger, primary_key=True, nullable=False)
    user_name = db.Column(db.String(30),  nullable=False)
    polls_users_answers = db.relationship('Polls_users_answers', backref='users', lazy=True)


class Admins(db.Model):
    __tablename__ = 'admins'
    admin_name = db.Column(db.String(30), primary_key=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)


class Polls(db.Model):
    __tablename__ = 'polls'
    poll_id = db.Column(db.BigInteger, primary_key=True, nullable=False)
    question = db.Column(db.String, nullable=False)
    polls_answer_options = db.relationship('Polls_answer_options', backref='polls1', lazy=True)
    polls_users_answers = db.relationship('Polls_answer_options', backref='polls2', lazy=True)


class Polls_answer_options(db.Model):
    __tablename__ = 'polls_answer_options'
    poll_id = db.Column(db.BigInteger, db.ForeignKey('polls.poll_id'), primary_key=True, nullable=False )
    poll_answer_option = db.Column(db.String, primary_key=True, nullable=False)


class Polls_users_answers(db.Model):
    __tablename__ = 'polls_users_answers'
    poll_id = db.Column(db.BigInteger, db.ForeignKey('polls.poll_id'), primary_key=True, nullable=False )
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.user_id'), primary_key=True, nullable=False)
    user_answer = db.Column(db.String, nullable=False)
    

def save_poll_in_db(poll_question: str):
    if db.session.query(Polls).first() is None:
        poll_id = 1
    else:
        poll_id = db.session.query(func.max(Polls.poll_id)).scalar() + 1
    try:    
        db.session.add(Polls(poll_id=poll_id, question=poll_question))
        db.session.commit()
    except Exception as e:
        raise e
    return poll_id


def save_admin_in_db(admin_name: str, hashed_password: str):
    try:
        db.session.add(Admins(admin_name=admin_name, password=hashed_password))
        db.session.commit()
    except Exception as e:
        raise e


def save_answers_in_db(poll_id: int, poll_answers: list):
    for i in range(len(poll_answers)):
        try:    
            db.session.add(Polls_answer_options(poll_id=poll_id, poll_answer_option=poll_answers[i]))
            db.session.commit()
        except Exception as e:
            raise e
    
def get_admin_hashed_password(admin_name: str):
    admin = Admins.query.filter_by(admin_name=admin_name).first()
    return admin.password if admin is not None else None

def get_bot_response_error(exception):
    if type(exception).__name__ == 'IntegrityError': # user_id already exists in DB (register command)
        return Response("IntegrityError", status=403, mimetype='plain/text')
    if type(exception).__name__ == 'UnmappedInstanceError': # user_id not exists in DB (remove command)
        return Response("UnmappedInstanceError", status=403, mimetype='plain/text')
    else:
        # TODO: consider change to html response (with text of - Internal server error), make sure we don't break the bot flow of this response
        return Response("caught undefined excption", status=500, mimetype='plain/text')


def handle_http_error(exception, element_type: str):
    if type(exception).__name__ == 'IntegrityError':  # element is already exists in DB
        return get_http_response(status=400, html_body=f"{element_type} already exists in DB")
    if type(exception).__name__ == 'UnmappedInstanceError':  # element not exists in DB
        return get_http_response(status=400, html_body=f"{element_type} doesn't exists in DB")
    else:
        return get_http_response(status=500, html_body="Internal server error")


def get_react_http_response(status_code: int, body):
    react_response = make_response(jsonify(body), status_code,)
    react_response.headers["Content-Type"] = "application/json"
    return react_response


def get_http_response(status: int, html_body: str):
    text = f'''
            <!DOCTYPE html>
        <html>
            <head>
                <title> {status} : {HTTP_CODES[status]} </title>
            </head>
            <body> 
                <h1> {HTTP_CODES[status]} </h1>
                <p> {html_body} </p>
            </body>
        </html>
    '''

    return Response(response=text.encode('utf-8'), status=status,
                    headers={"Content-Type": "text/html",
                             "charset": "utf-8",
                             "Connection": "close"})

@app.route("/")
def home():
    return "Hello, Flask!"


@app.route("/register-user/", methods=['POST'])
def register_user():

    user_id = request.form['user_id']
    user_name = request.form['user_name']

    if request.method == 'POST':
        db.session.add(Users(user_id=user_id, user_name=user_name))
        try:
            db.session.commit()
        except Exception as e:
            return get_bot_response_error(e)

        return Response("successful request", status=200, mimetype='plain/text')
    else:
        return Response("invalid request", status=500, mimetype='plain/text')


@app.route("/remove-user/", methods=['DELETE'])
def remove_user():
    user_id = request.form['user_id']
    user_name = request.form['user_name']
    if request.method == 'DELETE':
        user = Users.query.filter_by(user_id=user_id, user_name=user_name).first()
        try:
            db.session.delete(user)
            db.session.commit()
        except Exception as e:
            return get_bot_response_error(e)
        return Response("successful request", status=200, mimetype='plain/text')
    else:
        return Response("invalid request", status=500, mimetype='plain/text')

def get_question_and_answers(request):
    poll_question = request.json['question']
    poll_answers = [request.json['answer1'], request.json['answer2']]
    if request.json['answer3'] != '':
        poll_answers.append(request.json['answer3'])
    if request.json['answer4'] != '':
        poll_answers.append(request.json['answer4'])
    return poll_question, poll_answers


@app.route("/admins/send-poll/", methods=['POST'])
@cross_origin()
def send_poll_to_user():
    poll_question, poll_answers = get_question_and_answers(request)

    try:
        poll_id = save_poll_in_db(poll_question)
        save_answers_in_db(poll_id, poll_answers)
    except:
        return get_react_http_response(status_code=500, body={"message": "Poll wasn't sent due to internal server error"})
    chat_ids_list = [5026409462, 2062535378]  # TODO: create function that return list of relevant chat ids (filter chat ids if needed)
    bot = Bot(token=TOKEN)

    # TODO: consider change send_poll to send message (ot just remove the 100% and view results in poll message)
    # TODO: make sure that send_poll can't raise errors 
    for i in range(len(chat_ids_list)):
        message = bot.send_poll(
            chat_ids_list[i],
            poll_question,
            poll_answers,
            is_anonymous=False,
            allows_multiple_answers=False
        )
        poll_id_mapper[message.poll.id] = poll_id

    return get_react_http_response(status_code=200, body={"message": "Poll created and sent successfully"})


@app.route("/bot/get-poll-answer/", methods=['POST'])
def get_poll_answer():
    user_id = request.form['user_id']
    poll_bot_id = request.form['poll_bot_id']
    answer_index = request.form['answer_index']

    poll_internal_id = poll_id_mapper[poll_bot_id]
    del poll_id_mapper[poll_bot_id]
    try:
        polls_answer_options = Polls_answer_options.query.filter_by(poll_id=poll_internal_id).all()
    except Exception as e:
        return get_bot_response_error(e)
    answer = polls_answer_options[int(answer_index)].poll_answer_option

    try:
        db.session.add(Polls_users_answers(poll_id=poll_internal_id, user_id=int(user_id), user_answer=answer))
        db.session.commit()
    except Exception as e:
        return get_bot_response_error(e)
    return Response("successful request", status=200, mimetype='plain/text')


@app.route("/admins/add-admin/", methods=['POST'])
@cross_origin()
def add_new_admin():
    admin_name = request.json['adminName']
    password = request.json['password']
    hashed_password = generate_password_hash(password)
    try:
        save_admin_in_db(admin_name, hashed_password)
    except Exception as e:
        if type(e).__name__ == 'IntegrityError':
            return get_react_http_response(status_code=400,
                                           body={"message": f"admin {admin_name} already exists"})
        return get_react_http_response(status_code=500, body={"message": "Admin wasn't added due to internal server error"})
    return get_react_http_response(status_code=200, body={"message": "admin added successfully"})


@app.route("/admins/get-admins-list", methods=['GET'])
@cross_origin()
def get_admins_list():
    try:
        admins = Admins.query.all()
    except Exception as e:
        return get_react_http_response(status_code=500,
                                       body={"message": "Could not retrieve admins list due to internal server error"})
    admins_list = []
    for admin in admins:
        admins_list.append(admin.admin_name)
    return get_react_http_response(status_code=200, body={"admins_list": admins_list})


@app.route("/admins/check-admin-authorization/", methods=['POST'])
@cross_origin()
def authorize_admin():
    admin_name = request.json['adminName']
    password = request.json['password']
    hashed_password = get_admin_hashed_password(admin_name)
    if hashed_password is None:
        return get_react_http_response(status_code=400, body={"message": f"admin {admin_name} doesn't exists in DB"})

    is_correct_password = check_password_hash(hashed_password, password)
    return get_react_http_response(status_code=200, body={"is_correct_password": is_correct_password})



if __name__ == '__main__':
    # db.drop_all()
    # db.create_all()
    init_bot()
    app.run(debug=False, port=5000)
    
    




