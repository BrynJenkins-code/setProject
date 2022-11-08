from flask import Flask, render_template
import jyserver.Flask as jsf

app = Flask(__name__)
@jsf.use(app)
class App:
   def __init__(self) -> None:
      pass
   def test(self):
      self.js.document.getElementById("hello").innerText="hello mate"
@app.route("/")
def home():
   return App.render(render_template("Home.html"))
if __name__ == "__main__":
   app.run()

