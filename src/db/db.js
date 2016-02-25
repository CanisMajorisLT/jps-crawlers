import mongoose from 'mongoose'


const DEFAULT_MONGO_ADRESS = 'mongodb://localhost:27017';

mongoose.connect(DEFAULT_MONGO_ADRESS);

// load models
import ParsedAd from './models/parsedAd'
import Crawl from './models/crawlLog'
