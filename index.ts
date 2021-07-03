import Express from 'express';
import BlogRouter from './server/routes/BlogRoute';
import UserRouter from './server/routes/UserRoute';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = Express();
app.use(Express.json({ limit: '50mb' }));
app.use(Express.urlencoded({ limit: '50mb', extended: true }));
app.use(
    cors({
        credentials: true,
        origin: '*',
    })
);
app.use(cookieParser());

app.use('/blog', BlogRouter);
app.use('/user', UserRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(Express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 4000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.listen(port);
