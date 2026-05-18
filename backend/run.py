from graph import graph

config = {"configurable": {"thread_id": "1"}}

result = graph.invoke({
    "code": "def hello(): pass",
    "findings": [{"severity": "CRITICAL", "line_number": 1, "suggestion": "test"}]
}, config)
print(result)