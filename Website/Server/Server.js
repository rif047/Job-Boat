require('dotenv').config();
require('./Config/Database');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');

const routes = require('./Routes');
const Login = require('./API/Auth/Login');
const Company_Login = require('./API/Auth/Company_Login');
const Employee_Login = require('./API/Auth/Employee_Login');
const BackupRoutes = require('./Config/Backup');
const Search = require('./Config/Search');
// const Check_Login = require('./Middlewares/Check_Login');

const app = express();
const PORT = process.env.PORT || 9000;

app.set('trust proxy', 1);

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "blob:"],
        },
    },
}));

app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
}));

app.use(cors({
    origin: [process.env.BACKEND_URL, process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Authorization'],
}));


app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));


app.use((req, res, next) => { res.setTimeout(10 * 60 * 1000); next(); });


app.use(express.static('Assets'));
app.use('/api/Images', express.static(path.join(__dirname, 'Assets/Images')));


app.get('/favicon.ico', (_, res) => res.sendStatus(204));
app.get('/', (_, res) => res.send('✅ Server Running Successfully...'));

app.use('/login', Login);
app.use('/company_login', Company_Login);
app.use('/employee_login', Employee_Login);


// app.use('/api', Check_Login, routes);
app.use('/api', routes);
app.use('/db', BackupRoutes);
app.use('/search', Search);


app.use((req, res) => { res.status(404).json({ error: 'Not Found' }); });


app.use((err, req, res, next) => {
    if (err.code === 'ECONNRESET') {
        console.log('⚠️ Client connection reset');
        return res.sendStatus(499);
    }

    console.error(err.stack || err);

    res.status(500).json({
        error:
            process.env.NODE_ENV === 'production'
                ? 'Internal Server Error'
                : err.message,
    });
});


const server = http.createServer(app);

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

server.listen(PORT, () => { console.log(`🚀 Server running on http://localhost:${PORT}`); });


server.on('connection', (socket) => {
    socket.on('error', (err) => {
        if (err.code === 'ECONNRESET') {
            console.log('⚠️ Socket connection reset');
        }
    });
});


const shutdown = (signal) => {
    console.log(`\n🛑 ${signal} received. Shutting down...`);
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });

    setTimeout(() => {
        console.log('❌ Force shutdown');
        process.exit(1);
    }, 10000);
};

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

process.on('unhandledRejection', (reason) => { console.error('❌ Unhandled Rejection:', reason); });

process.on('uncaughtException', (err) => { console.error('❌ Uncaught Exception:', err); });