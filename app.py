from flask import Flask, request, Response
from flask_sqlalchemy import SQLAlchemy
from bot_manager import init_bot

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/postgres'
db = SQLAlchemy(app)

class Users(db.Model):
    user_id = db.Column(db.BigInteger, primary_key=True, nullable=False)
    user_name = db.Column(db.String(30),  nullable=False)

class Admins(db.Model):
    admin_name = db.Column(db.String(30), primary_key=True, nullable=False)
    password = db.Column(db.String(32), nullable=False)

def get_http_response_error(excption):
    if type(excption).__name__ == 'IntegrityError': #user_id already exists in DB (register command)
        return Response("IntegrityError", status=403, mimetype='plain/text')
    if type(excption).__name__ == 'UnmappedInstanceError': #user_id not exists in DB (remove command)
        return Response("UnmappedInstanceError", status=403, mimetype='plain/text')
    else:
        return Response("caught undefined excption", status=500, mimetype='plain/text')

@app.route("/")
def home():
    return "Hello, Flask!"

@app.route("/register-user/", methods= ['POST'])
def register_user():

    user_id = request.form['user_id']
    user_name = request.form['user_name']

    if request.method == 'POST':
        db.session.add(Users(user_id=user_id, user_name=user_name))
        try:
            db.session.commit()
        except Exception as e:
            return get_http_response_error(e)

        return Response("successful requset", status=200, mimetype='plain/text')
    else:
       return Response("invalid request", status=500, mimetype='plain/text') 

@app.route("/remove-user/", methods= ['DELETE'])
def remove_user():
    user_id = request.form['user_id']
    user_name = request.form['user_name']
    if request.method == 'DELETE':
        user  = Users.query.filter_by(user_id=user_id, user_name=user_name).first()
        try:
            db.session.delete(user)
            db.session.commit()
        except Exception as e:
            return get_http_response_error(e)
        return Response("successful requset", status=200, mimetype='plain/text')
    else:
       return Response("invalid request", status=500, mimetype='plain/text') 


if __name__ == '__main__':
    init_bot()
    app.run(debug=False, port=5000)
    
    




