from flask import Flask, render_template,request,session,redirect,url_for,Response,jsonify

from flask import send_from_directory


app = Flask(__name__)      

app.secret_key = '1006d5d50a924cbc89ecb5fc9e987652'



@app.route('/echo', methods = ['GET','POST'])
def getkeywords():
    
    import simplejson as j
    if request.method=="POST":
        path=request.form['text']
        print path 
        # 	jso = getKeywordsFromText(path)
        return jsonify(j.loads(jso))
    

if __name__ == '__main__':
    app.run(host= 'https://api.api.ai/v1/query?v=20150910',port=8000)
    #app.run(debug=True)