const cors = require("cors");
const express = require('express');
const stripe = require('stripe')("sk_test_51JufmRSCOykTkC68iO37kIWcEW4RA2fVLizCe9uyw57SUmDqIuYRrmT6aDxlx4ndjGhG8vAz3WagUnai64lRtxkl0062FCitv0");  //add a stripe key
//const uuid = require('uuid/v4');


const app = express();


//middleware
app.use(express.json());
app.use(cors());


//routes
app.get("/", (req, res) => {
  res.send("It Works at my website");
});

app.post("/payment", (req, res) => {

  const {product, token} = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idempotencyKey = uuid()

  return stripe.customers.create({
    email: token.email,
    source: token.id
  }).then((customer) => {
       stripe.charges.create({
         amount: product.price * 100,
         currency: 'usd',
         customer: customer.id,
         recipient_email: token.email,
         description: product.name,
         shipping: {
           name: token.card.name,
           address: {
             counrty: token.card.address_country,
           }
         }
       }, {idempotencyKey})
  })
  .then(result => res.status(200).json(result))
  .catch((err) => console.error(err))

})


//listen 
app.listen(8282, () => console.log('listening at port 8282'));