const express=require('express')
const ejs=require('ejs')
const fs=require('fs')
const app=express()
const bodyParser=require('body-parser')
const session=require('express-session')
const path=require('path')
const bcrypt=require('bcrypt-nodejs')
const mongoose=require('mongoose')
require('dotenv').config()
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')

app.use(express.static(path.join(__dirname)))
app.use(bodyParser.urlencoded({extended:false}))

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true})

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
}))

const test_path=['html/','ejs/']

const newPost=[
    {
        boardId:'study',
        boardName:'스터디',
        title:'노강호'
    },
    {
        boardId:'alba',
        boardName:'알바',
        title:'노현욱'
    },
    {
        boardId:'contest',
        boardName:'공모전',
        title:'박민재'
    },
    {
        boardId:'club',
        boardName:'동아리',
        title:'서주원'
    },
    {
        boardId:'gonggu',
        boardName:'공구',
        title:'조민지'
    }
]

const Lecture=[
    {
        lectureId:'CSE203-01',
        title:'컴퓨터구조',
        professor:'정연모'
    },
    {
        lectureId:'CSE223-00',
        title:'오픈소스SW개발',
        professor:'진성욱'
    },
    {
        lectureId:'CSE302-00',
        title:'컴퓨터네트워크',
        professor:'유인태'
    },
    {
        lectureId:'CSE304-00',
        title:'알고리즘분석',
        professor:'한치근'
    },
    {
        lectureId:'GED1408-G03',
        title:'공학과경영',
        professor:'김명섭'
    },
    {
        lectureId:'GED1504-G01',
        title:'공학과윤리',
        professor:'박수정'
    },
    {
        lectureId:'GEE1344-G02',
        title:'내손안의소프트웨어',
        professor:'이승형'
    }
]

const newLecturePost=[
    {
        title:'노강호',
        lecture: {
            lectureId:'CSE203-01',
            title:'컴퓨터구조',
        }
    },
    {
        title:'노현욱',
        lecture: {
            lectureId:'CSE223-00',
            title:'오픈소스SW개발',
        }
    },
    {
        title:'박민재',
        lecture: {
            lectureId:'CSE302-00',
            title:'컴퓨터네트워크',
        }
    },
    {
        title:'서주원',
        lecture: {
            lectureId:'CSE304-00',
            title:'알고리즘분석',
        }
    },
    {
        title:'조민지',
        lecture: {
            lectureId:'GED1408-G03',
            title:'공학과경영',
        }
    },
]

const newMarketPost=[
    {
        tag:'삽니다',
        title:'노강호',
    },
    {
        tag:'삽니다',
        title:'노현욱',
    },
    {
        tag:'팝니다',
        title:'박민재',
    },
    {
        tag:'팝니다',
        title:'서주원',
    },
    {
        tag:'삽니다',
        title:'조민지',
    },
]

const newAlbaPost=[
    {
        tag:'상하차',
        title:'노강호'
    },
    {
        tag:'고깃집',
        title:'노현욱'
    },
    {
        tag:'도서관 근로',
        title:'박민재'
    },
    {
        tag:'술집',
        title:'서주원'
    },
    {
        tag:'과외',
        title:'조민지'
    },
]

const hotPost=[
    {
        boardId:'alba',
        boardName:'알바',
        title:'노강호'
    },
    {
        boardId:'gonggu',
        boardName:'공구',
        title:'노현욱'
    },
    {
        boardId:'contest',
        boardName:'공모전',
        title:'박민재'
    },
    /*
    {
        boardId:'study',
        boardName:'스터디',
        title:'서주원'
    },

    {
        boardId:'club',
        boardName:'동아리',
        title:'조민지'
    }
    */
]

const Users=require('./models/user')

const users=new Users()

app.get('/',(request,response)=>{
    response.redirect('/main')
})

app.get('/main',(request,response)=>{
    const session=request.session.ID
    fs.readFile(test_path[1]+'main.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(ejs.render(data,{
            Lecture:Lecture,
            newPost:newPost,
            newLecturePost:newLecturePost,
            newMarketPost:newMarketPost,
            newAlbaPost:newAlbaPost,
            hotPost:hotPost
        }))
    })
})

app.post('/login',(request,response)=>{
    const body=request.body
    Users.find({userId:body.userId})
        .then((data) => {
            //console.log(data)
            //console.log(data[0].password)
            if (bcrypt.compareSync(body.password,data[0].password)){
                request.session.userId = body.userId
                console.log(`${body.userId}가 접속했습니다.\n`)
                request.session.save(function(){
                    response.redirect('/main')
                })
            } else
            {
                response.send('유효하지 않습니다.\n')
            }
        })
        .catch((err) => {
            //response.end(err)
            console.log('로그인 거절')
            response.redirect('/main')
        })
})

app.get('/logout',(request,response)=>{
    delete request.session.ID
    response.redirect('/main')
});

app.get('/signup',(request,response)=>{
    fs.readFile(test_path[1]+'signup.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(ejs.render(data,{}))
    })
})

const create=require('./api/user/create.js')
let code=200

app.post('/signup',(request,response)=>{
    //console.log('post 받음')
    create.UserCreate(request,response,code)
})

app.get('/myclass/:id',(request,response)=>{
    fs.readFile(test_path[0]+'myclass.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.send(data)
    })
})

app.get('/study',(request,response)=>{
    fs.readFile(test_path[0]+'study.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.send(data)
    })
})

app.get('/hobby',(request,response)=>{
    fs.readFile(test_path[0]+'hobby.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.send(data)
    })
})

app.get('/alba',(request,response)=>{
    fs.readFile(test_path[0]+'alba.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.send(data)
    })
})

app.get('/club',(request,response)=>{
    fs.readFile(test_path[0]+'club.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.send(data)
    })
})

app.get('/contest',(request,response)=>{
    fs.readFile(test_path[0]+'contest.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.send(data)
    })
})

app.get('/market',(request,response)=>{
    fs.readFile(test_path[0]+'market.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.send(data)
    })
})

app.get('/gonggu',(request,response)=>{
    fs.readFile(test_path[0]+'gonggu.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.send(data)
    })
})

app.use('/api', require('./api'))

const swaggerDocument = YAML.load('./swagger/swagger.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.listen(process.env.PORT, ()=>{
    console.log(`listening on port: ${process.env.PORT}`)
})
