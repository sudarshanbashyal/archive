import Express from 'express';
import BlogRouter from './server/routes/TopicRoute';
import UserRouter from './server/routes/UserRoute';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = Express();
app.use(Express.json());
app.use(
    cors({
        credentials: true,
        origin: `http://localhost:3000`,
    })
);
app.use(cookieParser());

app.use('/topic', BlogRouter);
app.use('/user', UserRouter);

const port = process.env.PORT || 4000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
