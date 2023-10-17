const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();
const LogInCollection = require("./mongodb");
const BookingCollection = require("./booking");
const port = process.env.PORT || 3009;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const tempelatePath = path.join(__dirname, '../tempelates');
app.set('view engine', 'hbs');
app.set('views', tempelatePath);
const axios = require('axios');
// Secret key for signing the JWT
const secretKey = '123456';

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

// ... (Other routes)
app.get('/hotel', (req, res) => {
    res.render('hotel')
})
app.get('/logout', (req, res) => {
    res.render('login')
})

app.post('/signup', async (req, res) => {
    // Your existing code for signup

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
        email: req.body.email,
    })
    await data.save()

    // Generate a JWT token
    const token = jwt.sign({ username: req.body.name }, secretKey, { expiresIn: '1h' });

    // Pass the token to the client
    res.status(200).render("hotel", {
        naming: req.body.name,
        // token: token
    });
});


// Example using axios in a React component
axios.post('/bookings', data, {
    headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
    },
});


app.post('/login', async (req, res) => {
    try {
        // Your existing code for login

        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(200).render("hotel", { naming: `${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }

        // Generate a JWT token
        const token = jwt.sign({ username: req.body.name }, secretKey, { expiresIn: '1h' });

        // Pass the token to the client
        res.status(200).render("hotel", { naming: req.body.name, token: token });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Protected route (requires JWT)
app.get('/bookings', authenticateToken, (req, res) => {
    res.render('bookings');
});

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract the actual token value (remove 'Bearer ')
    const actualToken = token.split(' ')[1];

    jwt.verify(actualToken, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = user;
        next();
    });
}


app.post('/bookings', authenticateToken, async (req, res) => {
    try {
        // Your existing code for bookings

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
        res.status(200).render("hotel", {
            naming: req.body.name,
            token: req.header('Authorization')
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log('port connected');
});
