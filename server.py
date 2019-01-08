from flask import Flask, session, render_template, redirect, url_for,request,jsonify,json, make_response
from dbconnect import connection
from flask_cors import CORS
import datetime
from datetime import timedelta 


app = Flask(__name__)
CORS(app, supports_credentials=True)
@app.route('/api/login/student', methods=['POST'])
def studentlogin():
    data = request.get_json();
    username = data['username']
    password = data['password']
    cursor , conn = connection()
    sql = "select count(*) from credentials where userid = %s and password = %s" 
    cursor.execute(sql,(username , password))
    conn.close()
    count = cursor.fetchone()[0]
    if count > 0 :
        res = make_response(jsonify({'status' : '1'}))
        expire_date_time = datetime.datetime.today() + timedelta(days=30)
        expire_date_time = expire_date_time.strftime("%d %b %Y %H:%M:%S")
        res.set_cookie('userid',username,  expires=expire_date_time)
        res.set_cookie('type','student',  expires=expire_date_time)
        return res
    else :
        return jsonify({"status" : '0'})

@app.route('/api/login/admin', methods=['POST'])
def adminlogin():
    data = request.get_json();
    username = data['username']
    password = data['password']
    cursor , conn = connection()
    sql = "select count(*) from admins where userid = %s and password = %s" 
    cursor.execute(sql,(username , password))
    conn.close()
    count = cursor.fetchone()[0]
    if count > 0 :
        res = make_response(jsonify({'status' : '1'}))
        expire_date_time = datetime.datetime.today() + timedelta(days=30)
        expire_date_time = expire_date_time.strftime("%d %b %Y %H:%M:%S")
        res.set_cookie('userid',username, expires=expire_date_time)
        res.set_cookie('type','admin',  expires=expire_date_time)
        return res
    else :
        return jsonify({"status" : '0'})

@app.route('/api/fetchname/student' , methods = ['POST' , 'GET'])
def fetchstudentname():
    username = request.cookies.get('userid')
    cursor , conn = connection()
    sql = "select name from credentials where userid = %s "
    cursor.execute(sql , (username,))
    conn.close()
    return cursor.fetchone()[0]

@app.route('/api/fetchname/admin' , methods = ['POST' , 'GET'])
def fetchadminname():
    username = request.cookies.get('userid')
    cursor , conn = connection()
    sql = "select name from admins where userid = %s "
    cursor.execute(sql , (username,))
    conn.close()
    return cursor.fetchone()[0]


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