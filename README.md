# Infinity  

![lighthouse](https://user-images.githubusercontent.com/88940768/129455672-b67400c1-9d2c-414a-bff1-08d34eccb2a5.png)  
  
## Infinity is a small Twitter-like social media app built with NextJS.  
  
###### Infinity:  
✔️ [Next.js](https://github.com/vercel/next.js/) (React with SSR & SSG)  
✔️ Tweets system built with MongoDB  
✔️ Authentication system built with NextAuth.js  
✔️ SEO Friendly & Blazing Fast  
✔️ Responsive on Desktop Devices  
✔️ Images handled by [Cloudinary](https://cloudinary.com/)  
  
***TODO List***
- [ ] *500 & 404 errors pages* 😴
- [ ] *Caching* 🤔
- [ ] *ToS & Privacy Policy pages* 🤨
- [ ] *Security Headers* 🥱
- [ ] *Support for Mobile Devices* 😐
- [ ] *Fix Poor Design of Attributions Page* 🤗
- [ ] ~~Email Verification when creating an account~~	*(unnecessary)*  😄
  
###### How to start:
- Clone the repo
```
git clone https://github.com/szymondlugolecki/infinity.git
```

- Install required dependencies
```
cd infinity & npm install
```

- Make .env.local file with these variables
```
DATABASE_URL=mongodb://username:pass@localhost:27017/?authSource=admin
DB_USERNAME=mongodb_user_username
DB_PASS=mongodb_user_password
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
  
- Run MongoDB Server
```
./mongodb_server.bat
```

- Run MongoDB Server
```
./mongodb_server.bat
```

- Create an admin user
```
mongosh

use admin

db.createUser({
user: "myUserAdmin",
pwd: passwordPrompt(),
roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})
```
  
- Run the server
```
npm start
```  
  
![infinity_1](https://user-images.githubusercontent.com/88940768/129456041-823e6a4f-c467-40ee-9a05-e98b65023d59.png)
![infinity_2](https://user-images.githubusercontent.com/88940768/129456045-6de7cb6c-832e-4a73-9715-4eb546e8cca4.png)
![infinity_3](https://user-images.githubusercontent.com/88940768/129456046-b396e05f-16e3-468e-acfd-aa45ae444f85.png)
