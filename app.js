const express=require('express');
const ejs=require('ejs');
const fs=require('fs');
const app=express();
const bodyParser=require('body-parser');
const session=require('express-session');
const path=require('path');
const bcrypt=require('bcrypt-nodejs')

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret:'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave:false,
    saveUninitialized:true
}));

const test_path=['html/','ejs/'];

const users =[
    {
        ID:'Jo',
        PW:bcrypt.hashSync('20175298',bcrypt.genSaltSync(10))
    },
    {
        ID:'Seo',
        PW:bcrypt.hashSync('123',bcrypt.genSaltSync(10))
    }
]

let currID=0

const stuClasses=[
    {
        classID:"CSE203-01",
        className:"컴퓨터구조",
        professor:"정연모"
    },
    {
        classID:"CSE223-00",
        className:"오픈소스SW개발",
        professor:"진성욱"
    },
    {
        classID:"CSE302-00",
        className:"컴퓨터네트워크",
        professor:"유인태"
    },
    {
        classID:"CSE304-00",
        className:"알고리즘분석",
        professor:"한치근"
    },
    {
        classID:"GED1408-G03",
        className:"공학과경영",
        professor:"김명섭"
    },
    {
        classID:"GED1504-G01",
        className:"공학과윤리",
        professor:"박수정"
    },
    {
        classID:"GEE1344-G02",
        className:"내손안의소프트웨어",
        professor:"이승형"
    }
]

const findUser=(ID,PW)=>{
    return users.find(value=>(value.ID===ID && bcrypt.compareSync(PW,value.PW)));
}

const findUserIndex=(ID,PW)=>{
    return users.findIndex(value=>(value.ID ===ID && bcrypt.compareSync(PW,value.PW)));
}
app.get('/',(request,response)=>{
    response.redirect('/main');
});
app.get('/main',(request,response)=>{
    const session=request.session;
    fs.readFile(test_path[1]+'main.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.end(ejs.render(data,{
            stuClasses:stuClasses
        }))
    });
});

app.post('/login',(request,response)=>{
    const body=request.body;
    if(findUser(body.ID,body.PW)){
        request.session.ID=findUserIndex(body.ID,body.PW);
        console.log(`${body.ID}가 접속했습니다.\n`);
        currID=body.ID
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
    fs.readFile(test_path[0]+'signup.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.post('/signup',(request,response)=>{
    const body=request.body
    if(!findUser(body.ID,body.PW)){
        const salt=bcrypt.genSaltSync(10)
        const hash=bcrypt.hashSync(body.PW,salt)
        users.push({
            ID:body.ID,
            PW:hash
        })
        response.end(alert('회원가입이 성공적으로 완료되었습니다.\n다시 로그인해 주세요.'))
    }
    else{
        response.end(alert('이미 존재하는 계정입니다.'))
    }
    response.redirect('/main')
})

app.get('/myclass/:id',(request,response)=>{
    fs.readFile(test_path[0]+'signup.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/study',(request,response)=>{
    fs.readFile(test_path[0]+'study.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/hobby',(request,response)=>{
    fs.readFile(test_path[0]+'hobby.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/alba',(request,response)=>{
    fs.readFile(test_path[0]+'alba.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/club',(request,response)=>{
    fs.readFile(test_path[0]+'club.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/contest',(request,response)=>{
    fs.readFile(test_path[0]+'contest.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/market',(request,response)=>{
    fs.readFile(test_path[0]+'market.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.get('/gonggu',(request,response)=>{
    fs.readFile(test_path[0]+'gonggu.ejs','utf-8',(error,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.render(data);
    });
});

app.listen(3000);

console.log("Server is running\n");
console.log(path.join(__dirname,'..','html'))