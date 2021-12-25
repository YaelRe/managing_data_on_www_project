from flask import Flask, request, Response
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/postgres'
db = SQLAlchemy(app)

class Users(db.Model):
    name = db.Column(db.String(80), primary_key=True, nullable=False)
class Admins(db.Model):
    name = db.Column(db.String(80), primary_key=True, nullable=False)

def get_http_response_error(excption):
    if type(excption).__name__ == 'IntegrityError': #user already exists in DB (register command)
        return Response("IntegrityError", status=403, mimetype='plain/text')
    if type(excption).__name__ == 'UnmappedInstanceError': #user not exists in DB (remove command)
        return Response("UnmappedInstanceError", status=403, mimetype='plain/text')
    else:
        return Response("caught undefined excption", status=500, mimetype='plain/text')

@app.route("/")
def home():
    return "Hello, Flask!"

@app.route("/register-user/<user_name>", methods= ['POST'])
def register_user(user_name):
    if request.method == 'POST':
        db.session.add(Users(name=user_name))
        try:
            db.session.commit()
        except Exception as e:
            return get_http_response_error(e)
        #users = Users.query.all()
        return Response("successful requset", status=200, mimetype='plain/text')
    else:
       return Response("invalid request", status=500, mimetype='plain/text') 

@app.route("/remove-user/<user_name>", methods= ['DELETE'])
def remove_user(user_name):
    if request.method == 'DELETE':
        user  = Users.query.filter_by(name=user_name).first()
        try:
            db.session.delete(user)
            db.session.commit()
        except Exception as e:
            return get_http_response_error(e)
        return Response("successful requset", status=200, mimetype='plain/text')
    else:
       return Response("invalid request", status=500, mimetype='plain/text') 










if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000)
    




