import Express from 'express';
import BlogRouter from './server/routes/TopicRoute';

const app = Express();

app.use('/topic', BlogRouter);

const port = process.env.PORT || 4000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
