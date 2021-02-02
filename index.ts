import Express from 'express';
import dotenv from 'dotenv';

const app = Express();
dotenv.config();

app.listen(3000, () => {
    console.log('server up...');
});
