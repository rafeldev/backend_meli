const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const axios = require('axios').default;

const app = express();
const PORT = 3001

// //body parse
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());



app.use(cors())


app.get('/api/items', async (req, res) => {
  console.log(req.query.q)
  const items = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=:${req.query.q}`)

  console.log(items.data.results)
  res.status(200).json({
    author: {
      name: 'Rafael',
      lastname: 'Alvarez Cardona'
    },
    items: items.data.results.filter((item, index) => {
      if (index < 4) {
        return item
      }
    }).map(item => {
      return {
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: item.price,
          decimals: 0
        },
        picture: item.thumbnail,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
      }
    })
  })
})

app.get('/api/items/:id', async (req, res) => {
  const id = req.params.id;
  const {data} = await axios.get(`https://api.mercadolibre.com/items/${id}`)
  const description = await axios.get(`https://api.mercadolibre.com/items/${id}/description`)

  // console.log(item.data);
  res.status(200).json({
    author: {
      name: 'Rafael',
      lastname: 'Alvarez Cardona'
    },
    id: data.id,
    title: data.title,
    price: {
      currency: data.currency_id,
      amount: data.price,
      decimals: 0
    },
    picture: data.thumbnail,
    condition: data.condition,
    free_shipping: data.shipping.free_shipping,
    sold_quantity: data.sold_quantity,
    description: description.data.plain_text
  })
})


app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`)
})

