//console.log("Ok ok");
const express=require("express");
const bodyParser=require("body-parser");
//const handlebars=require("handlebars");
const app=express();
const lodash=require("lodash");
const fs=require("fs");
var path=require("path");
const JSONStream=require("JSONStream");
var engines=require("consolidate");
//const startCase=require("startCase");
app.listen(2020,()=>{console.log("it's runing at port 2020:");})

app.engine('hbs',engines.handlebars);
app.set('view engine','hbs');
app.set('views','./views');

app.use('/profilepics', express.static('images'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/',(req,res)=>{
     let users =[];
     fs.readdir('users',function (err,files)// doc all file
    {
             if(err) throw err
             files.forEach(function (file){//lap 

                fs.readFile(path.join(__dirname,'users',file),{encoding:'utf8'},function(err,data){
                
                if (err) throw err
                const user= JSON.parse(data);
                user.name.full=lodash.startCase(user.name.first+''+user.name.last);
                users.push(user);
                if(users.length === files.length)
                res.render('index', { users:users})
            })//doc tung file
        })//het 1 function
    })
})
app.get('/:username',function (req,res){
    var username=req.params.username;
    var user=getUser(username);
    //res.send(user);
    res.render('user',{
        user:user,
        address:user.location
    })
})
function getUser(userName){
    var user=JSON.parse(fs.readFileSync(getUserFilePath(userName),{endcoding:'utf8'}));
    user.name.full=lodash.startCase(user.name.first + ' ' + user.name.last);
    lodash.keys(user.location).forEach(function (key){
        user.location[key]=lodash.startCase(user.location[key]);
    });
    return user;
}
function getUserFilePath(userName){
    return path.join(__dirname, 'users', userName) + '.json';
}
app.put('/:username',function(req,res){
        var username=req.params.username;
        var user=getUser(username);
        user.location=req.body;
        saveUser(username,user);
        res.render(req.body);
})
    app.delete('/:username',function(req,res){
        var fp=getUserFilePath(req.params.username);
        fs.unlinkSync(fp);
        res.sendStatus(200);
    })
function saveUser(username,data){
        var fp=getUserFilePath(username)
        fs.unlinkSync(fp)
        fs.writeFileSync(fp,JSON.stringify(data,null,2),{endcoding:'utf8'})
}

