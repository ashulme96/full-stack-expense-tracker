const express = require('express');
require('dotenv').config();
const app = express();
var cors = require('cors')
const https=require('https');
const fs=require('fs')
const path=require('path')

const {sequelize} = require('./database/squelize');
const {Expense} = require('./model/expenditure');
const {User} = require('./model/login');
const {Order}=require('./model/orders.js')
const ForgetPassword=require('./model/ForgotPasswordRequests.js')


const expenseRoutes = require('./router/router.js')
const purchaseRoute=require('./router/purchase.js')
const premium=require('./router/premium')
const forgotpassword=require('./router/forgetPassward');
// const helmet=require('helmet')// this is use for increasing Security  after deploying
const compression=require('compression');
// const morgan=require('morgan')// it is use to collect log details 

const Port=process.env.PORT|| 5000;

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false }));

// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(cors())

// app.use(helmet())// this is use for increasing Security  after deploying
app.use(compression())// it is use to decrease the file size we sending to the client
// app.use(morgan('combined', { stream: accessLogStream }));

app.use('/', expenseRoutes)
app.use('/api',purchaseRoute)
app.use('/api/premium',premium)
app.use('/api',forgotpassword)

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../' ,'view/${req.url}'));
});

app.get('/',(req,res)=>{
    res.send({successful:true})
})

//Association
User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgetPassword)
ForgetPassword.belongsTo(User);

sequelize.sync().then((result) => {
    app.listen(Port);
}).catch((err) => {
    console.log(err)
})
