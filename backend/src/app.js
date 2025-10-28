const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./config/passport');
const { errorHandler } = require('./utils/errorHandler');
const { CORS_ORIGIN, SESSION_SECRET } = require('./config/env');
const logger = require('./utils/logger');
const userRoutes = require('./routes/user.routes');
const companyRoutes = require('./routes/company.routes');
const employerRoutes = require('./routes/employer.routes');
const jobRoutes = require('./routes/job.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(helmet());

const { NODE_ENV } = require('./config/env');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://192.168.128.122:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  credentials: true,
};

if (NODE_ENV === 'production') {
  corsOptions.origin = function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  };
} else {
  corsOptions.origin = true;
}

app.use(cors(corsOptions));


app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/employer', employerRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use(errorHandler);

module.exports = app;
