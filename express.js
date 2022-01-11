const mongoose = require('mongoose');

const express = require('express');
const app = express();

const Card = require('./models/CardModel');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use(express.json())

app.use('/static',express.static('static'))

app.get('/api/',async (req,res,next)=>{
    let cards;
    try {
        cards = await Card.find();
    }catch(err){
        return next({
            error:"Something went wrong.Please try again later.",
            status:500
        })
    }
    if(!cards){
        return next({
            error:"There are no cards available.",
            status:404
        })
    }

    return res.status(200).json({
        cards:cards.map(card => card.toObject({getters:true}))
    })
})

app.post('/api/addcard',async (req,res,next)=>{
    const {
        name,
        dob
    } = req.body;

    const card = new Card({
      name: name,
      dob: dob,
    });

    try{
        await card.save();
    }catch(err){
        return next({
            error:"Something went wrong.Please try again later.",
            status:500
        })
    }

    res.status(200).json({
        message:"Success"
    })
})

app.get('/api/topcards',async (req,res,next)=>{
    let cards;
    let top7Cards;
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth()+1;
    try{
        cards = await Card.find();
        top7Cards = cards.filter(card => {
            const day = parseInt(card.dob.substring(8,10));
            const month = parseInt(card.dob.substring(5, 7));
            if (month >= currentMonth){
                if(month == currentMonth ){
                    if (day > currentDay) 
                        return true;
                    else
                        return false;
                }else{
                    return true;
                }
            }
            return false;
        }).sort((x, y) => {
          const x1 = x.dob.substring(5, 10);
          const y1 = y.dob.substring(5, 10);
          if(x1 > y1)
            return 1;
          return -1;
        })
        .slice(0,7);
    }catch(err){
        return next({
            error:"Something went wrong.Please try again later.",
            status:500
        })
    }
    if(!top7Cards){
        return next({
            error:"There are no cards to show.",
            status:"404"
        })
    }

    return res.status(200).json({
        cards:top7Cards.map(card => card.toObject({getters:true}))
    })
})

app.get('/api/card/:id',async (req,res,next)=>{
    const cardId = req.params.id;
    let card;
    try{
        card = await Card.findById(cardId);
    }catch(err){
        return next({
            error:"Something went wrong.Please try again later.",
            status:500
        })
    }
    
    if(card == null){
        return next({
            error:"There is no card for the specified id.",
            status:404
        })
    }

    return res.status(200).json({
        data:card.toObject({getters:true})
    })
})

app.use((error,req,res,next)=>{
    res.status(error['status']).json({
        message : error['error'],
    })
})



mongoose
  .connect(
    'mongodb+srv://' +
      'abhinai10'+
      ':' +
      'Abhinai10' +
      '@cluster0.owkzj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  )
  .then((res) => {
    console.log('Server connected to mongodb');
  })
  .catch((err) => {
    console.log('server did not connnected to mongodb');
  });

app.listen(5000, () => {
  console.log('Server created on port 5000');
});
