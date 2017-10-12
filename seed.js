'use strict'

// Incorporated VR's guitars. Needs to test that there won't be collisons

// Run 'node seed' or 'npm run seed' to seed user and products.
// There might be error messages giving on unique constraints, which should not cause any real problem

// At the moment, there is no data for order/reviews, as the logics for those still need work

const faker = require('faker'),
  Promise = require('bluebird'),
  db = require('./server/db'),
  models = db.models,
  numProducts = 100,
  numUsers = 50,
  Categories = ['Phone', 'Music Instruments', 'Books', 'Cool Stuff']

function doTimes (n, fn) {
  var results = []
  while (n--) results.push(fn(n))
  return results
}

function randUser (n) {
  return models.User.build({
    name: faker.name.findName(),
    password: faker.internet.password(),
    imgUrl: faker.internet.avatar(),
    email: faker.internet.email(),
    isAdmin: false,
    phone: faker.phone.phoneNumber(),
    shipAddress: faker.address.streetAddress(),
    shipCity: faker.address.city(),
    shipState: faker.address.state(),
    shipZip: faker.address.zipCode()
  })
}

function randProduct (n) {
  return Promise.map(
    Array(...Array(faker.random.number(2) + 1)).map(
      (cv, i, arr) => arr.length - i
    ),
    catId => models.Category.findById(catId)
  ).then(categories => {
    return models.Product
      .create({
        title: `${faker.commerce.productName()} Model ${faker.random.number(
          2999
        )}`,
        description: faker.company.bs(),
        price: faker.commerce.price(),
        inventory: 1000 + faker.random.number(19999),
        imgUrls: [faker.image.cats()]
      })
      .then(product => product.setCategories(categories))
  })
}

function randOrder (n) {
  let userId = n + 1
  return models.Order.create({userId, address: 'Fullstack 25th Fl, NY'})
    .then(cart => {
      return Promise.map(
        Array(...Array(faker.random.number(5) + 1))
        .map(elem => faker.random.number(numProducts - 1) + 1),
        productId => cart.addProdToCart(productId, faker.random.number(10) + 1)
      )
    })
    .then(() => models.Order.getCartByUserId(userId))
    .then(cart => cart.submit())
}

function generateUsers () {
  var users = doTimes(numUsers, randUser)
  users.push(
    models.User.build({
      name: 'AJ Frank',
      password: 'password',
      imgUrl:
        'https://sendgrid.com/wp-content/uploads/2017/07/Headshot-178x178.jpg',
      email: 'alexanderjfrank@gmail.com',
      isAdmin: true
    })
  )

  users.push(
    models.User.build({
      name: 'Vince Rios',
      password: 'password',
      imgUrl: faker.internet.avatar(),
      email: 'vincr@graceshopper.com',
      isAdmin: true
    })
  )

  users.push(
    models.User.build({
      name: 'D Fan',
      password: 'password',
      imgUrl: faker.internet.avatar(),
      email: 'dfan@graceshopper.com',
      isAdmin: true
    })
  )

  return users
}

const
  generateProducts = () => doTimes(numProducts, randProduct),
  generateCategories = () => Categories.map(cat => models.Category.build({ name: cat })),
  generateOrders = () => doTimes(numUsers + 3, randOrder),

  createUsers = () => Promise.map(generateUsers(), user => user.save()),
  createCategories = () => Promise.map(generateCategories(), category => category.save()),
  createProducts = () => Promise.all(generateProducts()),
  createOrders = () => Promise.all(generateOrders())

const guitars = () => {
  let categories
  return Promise.all([
    models.Category.create({ name: 'Electric Guitars' }),
    models.Category.create({ name: 'Acoustic Guitars' }),
    models.Category.create({ name: 'Guitar Amps' }),
    models.Category.create({ name: 'Synthesizers' }),
    models.Category.create({ name: 'Pianos' }),
    models.Category.create({ name: 'Violin Family' })
  ])
    .then(_categories => {
      categories = _categories
      return Promise.all([
        models.Product.create({
          description:
            'This simple, elegant semi-hollow features 57 Classic and Super 57 Classic pickups with matched bobbin windings for vintage humbucker tone with enhanced highs. Appointments include a great-feeling C neck profile with torrified maple fretboard, an improved truss rod, rolled neck binding, low-profile frets, Grover tuners and locking stopbar tailpiece for better sustain. Includes hardshell case.',
          title: 'Gibson ES-339 Studio Semi-Hollow Guitar',
          price: 1799.0,
          inventory: 3,
          imgUrls: [
            'Gibson_2016_ES-339_1.png',
            'Gibson_2016_ES-339_2.png',
            'Gibson_2016_ES-339_3.png',
            'Gibson_2016_ES-339_4.png',
            'Gibson_2016_ES-339_5.png'
          ]
        }),
        models.Product.create({
          description:
            'This simple, elegant semi-hollow features 57 Classic and Super 57 Classic pickups with matched bobbin windings for vintage humbucker tone with enhanced highs. Appointments include a great-feeling C neck profile with torrified maple fretboard, an improved truss rod, rolled neck binding, low-profile frets, Grover tuners and locking stopbar tailpiece for better sustain. Includes hardshell case.',
          title: 'Gibson 2016 ES-335 Studio Semi-Hollow Electric Guitar',
          price: 1799.0,
          inventory: 1,
          imgUrls: [
            'Gibson_2016_ES-335_1.png',
            'Gibson_2016_ES-335_2.png',
            'Gibson_2016_ES-335_3.png',
            'Gibson_2016_ES-335_4.png',
            'Gibson_2016_ES-335_5.png',
            'Gibson_2016_ES-335_6.png',
            'Gibson_2016_ES-335_7.png'
          ]
        }),
        models.Product.create({
          description:
            'The L-4 was developed as a louder, bolder update of Gibson popular L-1 and L-3 designs, advertised as a grand concert size model with 20 frets, one more than its predecessors. Over time the humbuckers proved the most versatile and practical, and thus today graceful mahogany L-4 CES model reached maturity.',
          title: 'Gibson L-4 CES Mahogany Hollowbody Electric Guitar Wine Red',
          price: 6499.0,
          inventory: 1,
          imgUrls: [
            'Gibson_L-4_CES_M_1.png',
            'Gibson_L-4_CES_M_2.png',
            'Gibson_L-4_CES_M_3.png',
            'Gibson_L-4_CES_M_4.png',
            'Gibson_L-4_CES_M_5.png',
            'Gibson_L-4_CES_M_6.png',
            'Gibson_L-4_CES_M_7.png'
          ]
        }),
        models.Product.create({
          description:
            'The Martin Performing Artist Series Custom GPCPA5 Grand Performance Acoustic-Electric Guitar combines that world-famous Martin sound with the contemporary playability of an electric guitar. Its unique body design blends a tight waist with a deep body. The end result is a tone that is well-defined, plus a massive amount of power and projection. Its solid Sitka spruce top is braced perfectly to give you a rich, full-bodied tone that is versatile enough for any musical situation. The body is rounded out with forest-friendly rosewood HPL back and sides to give you an attractive visual look.',
          title:
            'Martin Performing Artist Series Custom GPCPA5 Grand Performance Acoustic-Electric Guitar Natural',
          price: 699.0,
          inventory: 5,
          imgUrls: [
            'Martin_Artist_Custom_GPCPA5_1.png',
            'Martin_Artist_Custom_GPCPA5_2.png',
            'Martin_Artist_Custom_GPCPA5_3.png',
            'Martin_Artist_Custom_GPCPA5_4.png',
            'Martin_Artist_Custom_GPCPA5_5.png',
            'Martin_Artist_Custom_GPCPA5_6.png'
          ]
        }),
        models.Product.create({
          description:
            'Designed with electric players in mind, the T5z brings more of an electric guitar look and feel to the popular hollowbody hybrid electric-acoustic T5 series. Electric-friendly features include a more compact body than the original T5, plus a 12-inch fretboard radius and jumbo frets that making bending strings easier. If you are looking for a versatile stage or recording guitar that blends the feel of an electric with a full range of acoustic and electric tones, the T5z gives you an essential musical tool.',
          title: 'Taylor T5z Pro Acoustic-Electric Guitar',
          price: 2699.0,
          inventory: 7,
          imgUrls: [
            'Taylor_T5z_Pro_Acoustic-Electric_Guitar_1.png',
            'Taylor_T5z_Pro_Acoustic-Electric_Guitar_2.png',
            'Taylor_T5z_Pro_Acoustic-Electric_Guitar_3.png',
            'Taylor_T5z_Pro_Acoustic-Electric_Guitar_4.png',
            'Taylor_T5z_Pro_Acoustic-Electric_Guitar_5.png',
            'Taylor_T5z_Pro_Acoustic-Electric_Guitar_6.png'
          ]
        }),
        models.Product.create({
          description:
            'The Korg Kronos is the flagship keyboard of Korgs synthesizer line. It is available in three configurations, each with the same phenomenal performance, production and synthesis capacity. The only difference between the three models is the key bed. This is the full 88-key version, equipped with Korgs RH-3 (Real Weighted Hammer Action 3) keyboard, one of the professional keyboard industrys best-loved piano touches. It is the same keyboard used on Korgs upper-end piano models and on the Korg SV-1. The hammer weighting is graded, providing a heavier feel in the lower register and a lighter feel in the upper register, just as on a grand piano, offering superb playability.',
          title:
            'Korg New Kronos 88-Key Piano, Synthesizer & Music Workstation',
          price: 3699.0,
          inventory: 3,
          imgUrls: [
            'Korg_New_Kronos_88_1.png',
            'Korg_New_Kronos_88_2.png',
            'Korg_New_Kronos_88_3.png',
            'Korg_New_Kronos_88_4.png',
            'Korg_New_Kronos_88_5.png',
            'Korg_New_Kronos_88_6.png'
          ]
        }),
        models.Product.create({
          description:
            'Rolands JUNO synths are known everywhere for their great sound, ease of use, and exceptional value. Beginning in the 70s with some of the earliest mass-produced analog synthesizers, the Juno lines new releases are always hotly anticipated. The JUNO-DS88 takes the iconic series to a new level of performance, adding many powerful enhancements while still keeping operation streamlined and simple. Equipped with 88 weighted-action keys for a premium feel, the versatile, intuitive JUNO-DS88 puts you in creative command, making it easy to produce exceptional music everywhere you play.',
          title: 'Roland JUNO-DS88 Piano & Synthesizer',
          price: 1000.0,
          inventory: 6,
          imgUrls: [
            'Roland_JUNO-DS88_1.png',
            'Roland_JUNO-DS88_2.png',
            'Roland_JUNO-DS88_3.png',
            'Roland_JUNO-DS88_4.png',
            'Roland_JUNO-DS88_5.png'
          ]
        }),
        models.Product.create({
          description:
            'With the size of a combo, but sporting two 12" 60-watt Celestion Vintage 30 speakers, this compact-sized PPC212-OB speaker cabinet from the Orange PPC series features an open-back design and is the same size as the Rockerverb 50C and AD30TC. The Orange speaker cab features a power handling of 120 watts, producing sizzling guitar tone that is unmistakably Orange. ',
          title:
            'Orange Amplifiers PPC Series PPC212OB 120W 2x12 Open Back Guitar Speaker Cab',
          price: 599.0,
          inventory: 10,
          imgUrls: [
            'Orange_Amplifiers_PPC212OB_1.png',
            'Orange_Amplifiers_PPC212OB_2.png'
          ]
        })
      ])
    })
    .then(products => {
      return Promise.all([
        categories[0].addProducts(products[0]),
        categories[1].addProducts(products[0]),
        categories[0].addProducts(products[1]),
        categories[1].addProducts(products[1]),
        categories[0].addProducts(products[2]),
        categories[1].addProducts(products[2]),
        categories[0].addProducts(products[3]),
        categories[1].addProducts(products[3]),
        categories[0].addProducts(products[4]),
        categories[1].addProducts(products[4]),
        categories[3].addProducts(products[5]),
        categories[4].addProducts(products[5]),
        categories[3].addProducts(products[6]),
        categories[4].addProducts(products[6]),
        categories[2].addProducts(products[7])
      ])
    })
}

const seed = () =>
  createUsers()
    .then(() => createCategories())
    .then(() => createProducts())
    .then(() => createOrders())
    .then(() => guitars())
    .catch(console.log)

console.log('Syncing database')

module.exports = () => db
  .sync({ force: true })
  .then(() => {
    console.log('Seeding database')
    return seed()
  })
  .then(() => {
    console.log('Seeding successful')
  })
  .catch(err => {
    console.error('Error while seeding')
    console.error(err.errors)
  })
