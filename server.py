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
    COLUMN_NAME = coursecode + '_' + coursename.replace(' ', '_')
    try:
        cursor , conn  = connection()
        sql = "insert into courses values(%s , %s)"
        cursor.execute(sql , (coursecode , COLUMN_NAME))
        sql = "alter table studentsdata add {0} varchar(30) DEFAULT 'no'".format(COLUMN_NAME);
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
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status" : 'Student added'})
    except:
        return jsonify({"status" : 'Already exists'})
@app.route('/api/changepassword/student' , methods = ['POST','GET'])
def changepassword_student():
    username = request.cookies.get('userid')
    data = request.get_json()
    currentpassword = data['currentpassword'] 
    newpassword = data['newpassword']
    cursor , conn  = connection()
    sql = "select password from credentials where userid = %s"
    cursor.execute(sql,(username,))
    conn.close()
    password = cursor.fetchone()[0]
    if password != currentpassword :
        return jsonify({"status" : 'Incorrect current password'})
    elif password == currentpassword :
        cursor , conn  = connection()
        sql = "update credentials set password = %s where userid = %s"
        cursor.execute(sql,(newpassword,username))
        conn.commit()
        conn.close()
        return jsonify({"status" : 'Password changed'})

@app.route('/api/changepassword/admin' , methods = ['POST','GET'])
def changepassword_admin():
    username = request.cookies.get('userid')
    data = request.get_json()
    currentpassword = data['currentpassword'] 
    newpassword = data['newpassword']
    cursor , conn  = connection()
    sql = "select password from admins where userid = %s"
    cursor.execute(sql,(username,))
    conn.close()
    password = cursor.fetchone()[0]
    if password != currentpassword :
        return jsonify({"status" : 'Incorrect current password'})
    elif password == currentpassword :
        cursor , conn  = connection()
        sql = "update admins set password = %s where userid = %s"
        cursor.execute(sql,(newpassword,username))
        conn.commit()
        conn.close()
        return jsonify({"status" : 'Password changed'})

@app.route('/api/fetchstudentdata' , methods = ['POST','GET'])         #data of a student
def fetchstudentdata():
    username = request.cookies.get('userid')
    cursor , conn  = connection()
    sql = "select * from studentsdata where usn = %s"
    cursor.execute(sql,(username,))
    conn.close()
    rows = [x for x in cursor]
    cols = [x[0] for x in cursor.description]
    ds = []
    for row in rows:
        d = {}
        for prop, val in zip(cols, row):
            if not val == 'no':
                d[prop] = val   
        ds.append(d)   
    json_data = json.dumps(ds)
    json_data = json_data[1:-1]
    json_obj = json.loads(json_data)
    return jsonify(json_obj)


@app.route('/api/fetchdata/<usn>' , methods = ['POST','GET'])
def fetchdata_by_usn(usn):
    username = usn
    try :
    	cursor , conn  = connection()
    	sql = "select * from studentsdata where usn = '{0}'".format(username);
    	cursor.execute(sql)
    	conn.close()
    	rows = [x for x in cursor]
    	cols = [x[0] for x in cursor.description]
    	ds = []
    	for row in rows:
        	d = {}
        	for prop, val in zip(cols, row):
        		if not val == 'no':
        			d[prop] = val
        	ds.append(d)
    	print(ds)   
    	json_data = json.dumps(ds)
    	json_data = json_data[1:-1]
    	json_obj = json.loads(json_data)
    	return jsonify(json_obj)
    except Exception as e:
    	print('Error is ', e)
    	return jsonify({"status" : 'invalid usn'})

@app.route('/api/fetchcourses' , methods = ['POST','GET'])        #for showing drop down list view&update
def fetchcourses():
    cursor , conn  = connection()
    sql = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'moodle' AND TABLE_NAME = 'studentsdata'"
    cursor.execute(sql)
    conn.close()
    rows = [x for x in cursor]
    cols = [x[0] for x in cursor.description]
    ds = []
    for row in rows:
        d = {}
        for prop, val in zip(cols, row):
            if not val == "usn":
                d[prop] = val
                ds.append(d)
    return jsonify(ds)


@app.route('/api/enrollNewCourse/<COLUMN_NAME>/<usn>' , methods = ['POST','GET'])
def enrollNewCourse(COLUMN_NAME , usn):
    cursor , conn  = connection()
    sql = "update studentsdata set %s = '0/0' where usn = '%s' and %s = 'no'" % (COLUMN_NAME, usn, COLUMN_NAME)
    print(sql)
    cursor.execute(sql)
    conn.commit()
    conn.close()
    return 'Enrolled Successfully'

@app.route('/api/updatescores/<usn>', methods=['POST'])       #update of a single student
def updatescores(usn):
    data = request.get_json();
    cursor , conn = connection()
    for key in data:
        sql = "update studentsdata set {0}='{1}' where usn='{2}'".format(key, data[key], usn);
        cursor.execute(sql)
    conn.commit()
    conn.close()
    return "Scores Updated"


@app.route('/api/fetchstudents/<COLUMN_NAME>' , methods = ['POST','GET'])
def fetchstudents(COLUMN_NAME):
    cursor , conn  = connection()
    sql = "select a.usn , b.name , a.{0} from studentsdata a , credentials b where a.{0} <> 'no' and a.usn = b.userid".format(COLUMN_NAME);
    cursor.execute(sql)
    rows = [x for x in cursor]
    cols = [x[0] for x in cursor.description]
    ds = []
    for row in rows:
        d = {}
        for prop, val in zip(cols, row):
            d[prop] = val
        ds.append(d)
    return jsonify(ds)    

@app.route('/api/updatescores/column/<COLUMN_NAME>', methods=['POST','GET'])       #update of a single student
def updatescoresbycourse(COLUMN_NAME):
    data = request.get_json()
    cursor , conn = connection()
    for key in data:
        sql = "update studentsdata set {0} = '{1}' where usn = '{2}'  ".format(COLUMN_NAME,data[key],key);
        cursor.execute(sql)
        print(sql)
    conn.commit()
    conn.close()
    return "Updated Successfully"

@app.route('/api/newadmin' , methods = ['POST','GET'])
def newadmin():
    data = request.get_json()
    username = data['username']
    name = data['name']
    password = data['password']
    try:
        cursor , conn  = connection()
        sql = "insert into admins values(%s , %s , %s)" 
        cursor.execute(sql,(username,name , password))
        conn.commit()
        conn.close()
        return jsonify({"status" : 'admin added'})
    except:
        return jsonify({"status" : 'Already exists'})

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=4000, debug=True)
