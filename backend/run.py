from graph import graph

config = {"configurable": {"thread_id": "1"}}

result = graph.invoke({"code": "def login(username, password): query = 'SELECT * FROM users WHERE username=' + username return db.execute(query)"}, config)
print(result)