from flask import Flask, session, render_template, redirect, url_for,request,jsonify,json, make_response
from dbconnect import connection
from flask_cors import CORS
import datetime
from datetime import timedelta 

app = Flask(__name__)
CORS(app, supports_credentials=True)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json();
    username = data['username']
    password = data['password']
    cursor , conn = connection()
    sql = "select count(*) from credentials where userid = %s and password = %s" 
    cursor.execute(sql,(username , password))
    rows = [x for x in cursor]
    cols = [x[0] for x in cursor.description]
    ds = []
    for row in rows:
        d = {}
        for prop, val in zip(cols, row):
            d[prop] = val
        ds.append(d)   
    json_data = json.dumps(ds)
    json_data = json_data[1:-1]
    json_obj = json.loads(json_data)
    conn.close()
    if json_obj['count(*)'] > 0 :
        res = make_response(jsonify({'status' : '1'}))
        expire_date_time = datetime.datetime.today() + timedelta(days=30)
        expire_date_time = expire_date_time.strftime("%d %b %Y %H:%M:%S")
        res.set_cookie('userid',username, expires=expire_date_time)
        return res
    else :
        return jsonify({"status" : '0'})

@app.route('/api/fetchname' , methods = ['POST' , 'GET'])
def fetchname():
    username = request.cookies.get('userid')
    cursor , conn = connection()
    sql = "select name from credentials where userid = %s "
    cursor.execute(sql , (username,))
    rows = [x for x in cursor]
    cols = [x[0] for x in cursor.description]
    ds = []
    for row in rows:
        d = {}
        for prop, val in zip(cols, row):
            d[prop] = val
        ds.append(d)   
    json_data = json.dumps(ds)
    json_data = json_data[1:-1]
    json_obj = json.loads(json_data)
    conn.close()
    return json_obj['name']

@app.route('/api/addcourse' , methods = ['POST','GET'])
def addcourse():
    data = request.get_json()
    coursecode = data['coursecode']
    coursename = data['coursename']
    try:
        cursor , conn  = connection()
        sql = "insert into courses values(%s , %s)" 
        cursor.execute(sql,(coursecode,coursename))
        conn.commit()
        sql = "alter table studentsdata add %s INT DEFAULT -1" % (coursecode)
        cursor.execute(sql)
        conn.commit()
        conn.close()
        return jsonify({"status" : 'Course added'})
    except:
        return jsonify({"status" : 'Already exists'})

    
@app.route('/api/addstudent' , methods = ['POST','GET'])
def addstudent():
    data = request.get_json()
    username = data['usn']
    name = data['name']
    try:
        cursor , conn  = connection()
        sql = "insert into credentials values(%s , %s , %s)" 
        cursor.execute(sql,(username,username , name))
        conn.commit()
        sql = "insert into studentsdata (usn) values(%s)"
        cursor.execute(sql,(username,))
        # print(cursor.fetchall())
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status" : 'Student added'})
    except:
        return jsonify({"status" : 'Already exists'})


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=4000, debug=True)