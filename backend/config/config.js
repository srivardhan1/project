module.exports={
    mongoConnectionString: process.env.MONGO_CONNECT_STRING||'',
    webPort: process.env.PORT||4000,
    //sessionSecret: process.env.SESSION_SECRET || 'goutham',
}
