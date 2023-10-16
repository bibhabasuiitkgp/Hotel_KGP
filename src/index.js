const express = require("express")
const path = require("path")
const app = express()
// const hbs = require("hbs")
const LogInCollection = require("./mongodb")
const BookingCollection = require("./booking")
const port = process.env.PORT || 3009
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
// const publicPath = path.join(__dirname, '../public')
// console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
// app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



app.get('/hotel', (req, res) => {
    res.render('hotel')
})

app.post('/signup', async (req, res) => {





    const checking = await LogInCollection.findOne({ name: req.body.name })

    try {
        if (checking.name === req.body.name && checking.password === req.body.password) {
            res.send("user details already exists")
        }
        else {
            await LogInCollection.insertMany([data])
        }
    }
    catch {
        res.render("login")
    }

    const data = new LogInCollection({
        name: req.body.name,
        password: req.body.password,
        rollnumber: req.body.rollnumber,
    })
    await data.save()



    res.status(200).render("hotel", {
        naming: req.body.name
    })
})


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(200).render("hotel", { naming: `${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    }

    catch (e) {

        res.send("wrong details")


    }


})

app.get('/bookings', (req, res) => {
    res.render('bookings');
});

app.post('/bookings', async (req, res) => {
    try {
        const bookingData = new BookingCollection({
            name: req.body.name,
            address: req.body.address,
            aadharNumber: req.body.aadharNumber,
            checkInDate: new Date(req.body.checkInDate), // Assuming you're sending a string date from the client
            checkOutDate: new Date(req.body.checkOutDate), // Assuming you're sending a string date from the client
            phoneNumber: req.body.phoneNumber,
            roomClass: req.body.roomClass,
        });

        await bookingData.save();

        res.status(200).send("Booking successful!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.listen(port, () => {
    console.log('port connected');
})