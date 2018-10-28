const express=require('express')
const ejs=require('ejs')
const fs=require('fs')
const app=express()
const bodyParser=require('body-parser')
const session=require('express-session')
const path=require('path')
const mongoose=require('mongoose')

require('dotenv').config()

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_DB)

var db = mongoose.connection
db.once('open', function () {
    console.log('MongoDB connected!')
})
db.on('error', function (err) {
    console.log('MongoDB ERROR:', err)
})

app.use(express.static(path.join(__dirname, '/static')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token')
    next()
  })
app.use(session({
    secret:'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave:false,
    saveUninitialized:true
}));

const test_path=['html/','ejs/'];

const users =[
    {
        ID:'Jo',
        PW:'20175298'
    },
    {
        ID:'Seo',
        PW:'123'
    }
]

const findUser=(ID,PW)=>{
    return users.find(value=>(value.ID===ID && value.PW===PW));
}

const findUserIndex=(ID,PW)=>{
    return users.findIndex(value=>(value.ID ===ID && value.PW === PW));
}
app.get('/',(request,response)=>{
    response.redirect('/main');
});
app.get('/main',(request,response)=>{
    const session=request.session;
    fs.readFile(test_path[0]+'main.html','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        //response.render(data);
        response.end(data);
    });
});

app.post('/login',(request,response)=>{
    const body=request.body;
    if(findUser(body.ID,body.PW)){
        request.session.ID=findUserIndex(body.ID,body.PW);
        console.log(`${body.ID}가 접속했습니다.\n`);
        response.redirect('/main');
    }
    else
    {
        response.send('유효하지 않습니다.\n');
    }
});

app.get('/logout',(request,response)=>{
    delete request.session.ID;
    response.redirect('/main');
});

app.get('/signup',(request,response)=>{
    fs.readFile('signup.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/study',(request,response)=>{
    fs.readFile('study.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/hobby',(request,response)=>{
    fs.readFile('hobby.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/alba',(request,response)=>{
    fs.readFile('alba.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/club',(request,response)=>{
    fs.readFile('club.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/contest',(request,response)=>{
    fs.readFile('contest.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/market',(request,response)=>{
    fs.readFile('market.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.use('/api', require('./api'))

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger/swagger.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/gonggu',(request,response)=>{
    fs.readFile('gonggu.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    })
})



app.listen(process.env.PORT, ()=>{
    console.log(`listening on port: ${process.env.PORT}`)
})