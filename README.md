# Express Insight

## Overview
Express Insight is a logging middleware for Express.js applications. This project aims to provide detailed insights into incoming requests and outgoing responses in an Express application, helping developers better understand and debug their web applications.

## Usage
Here's a basic implementation of the core plugin with the error plugin

```javascript
import express from 'express';
import ExpressInsight from 'express-insight';

const app = express();

const expInsight = ExpressInsight.setupExpressInsight(app, {
  projectName: "Local Project",
  error: {
    enable: true,
  },
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

expInsight.setupErrorPlugin();
app.listen(3000);
```

## Screenshots
![image](https://github.com/user-attachments/assets/26295ba0-dfeb-4ba8-8d5d-5dc440aee23c)



## Contribution
This is a personal project for learning purposes, but I'm open to suggestions and feedback. Feel free to open an issue if you have ideas on how I can improve this project or my coding practices.

## License
This project is open source and available under the [MIT License](LICENSE).

---

Created with 💓 by Saphal Poudyal
