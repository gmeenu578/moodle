from flask import Flask, session, render_template, redirect, url_for,request,jsonify,json
from dbconnect import connection
app = Flask(__name__)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json();
    username = data['username']
    password = data['password']
    cursor = connection()
    sql = "select count(*) from test where userid = %s and password = %s"
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
    if json_obj['count(*)'] > 0 :
        return '1'
    else :
        return '0'

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=4000, debug=True)

