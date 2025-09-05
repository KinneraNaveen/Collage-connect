const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://collage-connect-frontend.onrender.com']
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
