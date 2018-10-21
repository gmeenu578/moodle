import MySQLdb
import json
def connection():
    conn = MySQLdb.connect(host="localhost",
                           user = "moodle",
                           passwd = "password",
                           db = "moodle",
                           port=3306)
    c = conn.cursor()

    return c
def run():
    cursor = connection()
    username = "test"
    password = "test123"
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
    print(ds)     
    json_data = json.dumps(ds)
    print(json_data)
    json_data = json_data[1:-1]
    print(json_data)
    json_obj = json.loads(json_data)
    print(json_obj)
    print(json_obj['count(*)'])
run()

# def run():
# 	    cursor = connection()
# 	    userid="test"
# 	    password="test123"
# 	    sql = "select count(*) from test where userid = %s and password = %s"
# 	    cursor.execute(sql,(username , password))
# 	    rows = [x for x in cursor]
# 	    cols = [x[0] for x in cursor.description]
# 	    ds = []
# 	    for row in rows:
# 	  	    d = {}
# 	  	    for prop, val in zip(cols, row):
# 	  	  	      d[prop] = val
#       ds.append(d) 
#       print(ds)  
#       json_data = json.dumps(ds)
#       print(json_data)
#       json_data = json_data[1:-1]
#       json_obj = json.loads(json_data)
#       print(json_obj)
#     # if json_obj['count(*)'] > 0 :
#     #     return '1'
#     # else :
#     #     return '0'
# 	# cursor.execute('select * from test')
# 	# print(cursor.fetchall())
# 	    print(json_obj['count(*)'])
# run()
