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
const morgan = require('morgan')
const Users=require('./models/user.js')

app.use(morgan('[:date[iso]] :method :status :url :response-time(ms) :user-agent'))

app.use(express.static(path.join(__dirname)))

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
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
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
        tag:'과외',
        title:'서주원'
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
    {
        boardId:'study',
        boardName:'스터디',
        title:'서주원'
    },

]

app.get('/',(request,response)=>{
    response.redirect('/main')
})

app.get('/main',(request,response)=>{
    console.log('-GET /main-')
    const session=request.session
    console.log(`current session id : ${session.sid}`)
    Users.findOne({_id:session.sid})
        .then((user)=>{
            if(!user){
                fs.readFile('ejs/main.ejs','utf-8',(error,data)=>{
                    response.writeHead(200,{'Content-Type':'text/html'})
                    response.end(ejs.render(data,{
                        newPost:newPost,
                        newLecturePost: newLecturePost,
                        newMarketPost: newMarketPost,
                        newAlbaPost: newAlbaPost,
                        hotPost: hotPost,
                    }))
                })
            }
            else{
                fs.readFile('ejs/main_after.ejs','utf-8',(error,data)=>{
                    response.writeHead(200,{'Content-Type':'text/html'})
                    if(error)
                        throw error
                    else {
                        response.end(ejs.render(data, {
                            nickname: user.nickname,
                            resizedImage: user.resizedImage,
                            Lecture: Lecture,
                            newPost: newPost,
                            newLecturePost: newLecturePost,
                            newMarketPost: newMarketPost,
                            newAlbaPost: newAlbaPost,
                            hotPost: hotPost,
                        }))
                    }
                })
            }
        })
        .catch((err)=>{
            throw err
        })
    //console.log(`nickname in end of get() : ${nickname}` )
    //console.log(resizedImage)

})

app.post('/logout',(request,response)=>{
    console.log(`${request.session.userId}가 로그아웃했습니다.`)
    delete request.session.userId
    response.status(200).json({result:'Logout Successful'})
});

app.get('/signup',(request,response)=>{
    fs.readFile('ejs/signup.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(ejs.render(data,{}))
    })
})

app.get('/myclass/:id',(request,response)=>{
    fs.readFile('ejs/myclass.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(data)
    })
})

app.get('/study',(request,response)=>{
    fs.readFile('ejs/study.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(data)
    })
})

app.get('/hobby',(request,response)=>{
    fs.readFile('ejs/hobby.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(data)
    })
})

app.get('/alba',(request,response)=>{
    fs.readFile('ejs/alba.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(data)
    })
})

app.get('/club',(request,response)=>{
    fs.readFile('ejs/club.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(data)
    })
})

app.get('/contest',(request,response)=>{
    fs.readFile('ejs/contest.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(data)
    })
})

app.get('/market',(request,response)=>{
    fs.readFile('ejs/market.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(data)
    })
})

app.get('/gonggu',(request,response)=>{
    fs.readFile('ejs/gonggu.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'})
        response.end(data)
    })
})

app.use('/api', require('./api'))

const swaggerDocument = YAML.load('./swagger/swagger.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.listen(process.env.PORT, ()=>{
    console.log(`listening on port: ${process.env.PORT}`)
})
