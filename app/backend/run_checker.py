from chatbot.checker import Checker

# run checker
checker = Checker()

while True:
    try:
        checker.run()
    except Exception as e:
        print("outer error:", e)