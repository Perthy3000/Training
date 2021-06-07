# Training

---

Install all dependencies with `yarn install`

Change these values in [.env.default](./.env.default) and rename it to **.env**

- **MONGO_URL**
- **SECRET_KEY**
- **SALT_ROUNDS**

Run with nodemon `yarn start`

Run with PM2

```sh
> yarn pm2 startup
> yarn pm2 set pm2:autodump true
> yarn pm2 start app.js
```
