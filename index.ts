import Express from 'express';
import BlogRouter from './server/routes/BlogRoute';
import UserRouter from './server/routes/UserRoute';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = Express();
app.use(Express.json({ limit: '50mb' }));
app.use(Express.urlencoded({ limit: '50mb', extended: true }));
app.use(
    cors({
        credentials: true,
        origin: `http://localhost:3000`,
    })
);
app.use(cookieParser());

// setting up routes
app.use('/blog', BlogRouter);
app.use('/user', UserRouter);

const port = process.env.PORT || 4000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
