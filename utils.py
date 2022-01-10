from flask import Response, jsonify, make_response
from config import http_codes


def get_bot_response_error(exception):
    if type(exception).__name__ == 'IntegrityError': # user_id already exists in DB (register command)
        return Response("IntegrityError", status=403, mimetype='plain/text')
    if type(exception).__name__ == 'UnmappedInstanceError': # user_id not exists in DB (remove command)
        return Response("UnmappedInstanceError", status=403, mimetype='plain/text')
    else:
        return Response("Server Internal Error", status=500, mimetype='plain/text')


def handle_http_error(exception, element_type: str):
    if type(exception).__name__ == 'IntegrityError':  # element is already exists in DB
        return get_http_response(status=400, html_body=f"{element_type} already exists in DB")
    if type(exception).__name__ == 'UnmappedInstanceError':  # element not exists in DB
        return get_http_response(status=400, html_body=f"{element_type} doesn't exists in DB")
    else:
        return get_http_response(status=500, html_body="Internal server error")


def get_question_and_answers(request):
    poll_question = request.json['question']
    poll_answers = [request.json['answer1'], request.json['answer2'], request.json['answer3'], request.json['answer4']]
    while "" in poll_answers:
        poll_answers.remove("")
    return poll_question, poll_answers


def get_react_http_response(status_code: int, body):
    react_response = make_response(jsonify(body), status_code,)
    react_response.headers["Content-Type"] = "application/json"
    return react_response


def get_http_response(status: int, html_body: str):
    text = f'''
            <!DOCTYPE html>
        <html>
            <head>
                <title> {status} : {http_codes[status]} </title>
            </head>
            <body> 
                <h1> {http_codes[status]} </h1>
                <p> {html_body} </p>
            </body>
        </html>
    '''

    return Response(response=text.encode('utf-8'), status=status,
                    headers={"Content-Type": "text/html",
                             "charset": "utf-8",
                             "Connection": "close"})
