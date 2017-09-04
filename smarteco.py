from flask import Flask, render_template,request,session,redirect,url_for,Response,jsonify

from flask import send_from_directory


app = Flask(__name__)      

app.secret_key = '1006d5d50a924cbc89ecb5fc9e987652'



@app.route('/getkeywords', methods = ['GET','POST'])
def getkeywords():
    
    import simplejson as j
    if request.method=="POST":
        path=request.form['text']
        #print path 
        jso = getKeywordsFromText(path)
           
        return jsonify(j.loads(jso))
        
        
    else:
        return redirect(url_for('home'))
    

if __name__ == '__main__':
    #app.run(host= '10.207.60.126',port=5000)
    app.run(debug=True)