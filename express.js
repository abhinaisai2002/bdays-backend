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

app.get('/',async (req,res,next)=>{
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

app.post('/addcard',async (req,res,next)=>{
    const {
        name,
        dob
    } = req.body;

    const card = new Card({
      name: name,
      dob: dob,
    });

    try{
        await card.save()
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

app.get('/topcards',async (req,res,next)=>{
    let top7Cards;
    try{
        top7Cards = await Card.find().sort({dob:1,name:1}).limit(7);
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

app.get('/card/:id',async (req,res,next)=>{
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
    if(!card){
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
    console.log(err);
    console.log('server did not connnected to mongodb');
  });

app.listen(5000, () => {
  console.log('Server created on port 5000');
});
