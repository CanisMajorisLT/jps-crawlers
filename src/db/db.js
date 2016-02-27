import mongoose from 'mongoose'


const MONGODB_ADDRESS = process.env.NODE_ENV === 'prod' ? process.env.MONGO_URL :'mongodb://localhost:27017';

mongoose.connect(MONGODB_ADDRESS);

// load models
import ParsedAd from './models/parsedAd'
import Crawl from './models/crawlLog'
