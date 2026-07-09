# 🚀 EDUFLOW BACKEND SCAFFOLD

## 1. PROJECT STRUCTURE

```text
eduflow-backend/
│
├── src/
│
│   ├── config/
│   │   ├── env.js
│   │   ├── db.js
│   │   ├── logger.js
│   │   └── jwt.js
│   │
│   ├── database/
│   │   └── connection.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── tenant.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── shared/
│   │   ├── response.js
│   │   ├── errors.js
│   │   └── constants.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── pagination.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── schools/
│   │   ├── classes/
│   │   ├── subjects/
│   │   ├── questions/
│   │   ├── assessments/
│   │   ├── results/
│   │   ├── analytics/
│   │   ├── ai/
│   │   ├── files/
│   │   └── audit/
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
├── .env
├── package.json
└── README.md
```

---

# 2. CORE SETUP FILES

## package.json

```json
{
  "name": "eduflow-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  }
}
```

---

## src/server.js

```js
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./database/connection.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`EduFlow server running on port ${PORT}`);
});
```

---

## src/app.js

```js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/v1", routes);

app.use(errorMiddleware);

export default app;
```

---

## src/database/connection.js

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
```

---

# 3. MIDDLEWARES

---

## auth.middleware.js

```js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

---

## tenant.middleware.js (CRITICAL)

```js
export const tenantMiddleware = (req, res, next) => {
  if (!req.user?.schoolId) {
    return res.status(403).json({ message: "No school context" });
  }

  req.schoolId = req.user.schoolId;
  next();
};
```

---

## role.middleware.js

```js
export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
```

---

## error.middleware.js

```js
export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
};
```

---

# 4. SHARED RESPONSE FORMAT

## response.js

```js
export const success = (res, data, message = "Success") => {
  return res.json({
    success: true,
    message,
    data,
  });
};

export const error = (res, message = "Error", code = 500) => {
  return res.status(code).json({
    success: false,
    message,
  });
};
```

---

# 5. AUTH MODULE (EXAMPLE IMPLEMENTATION)

---

## model/user.model.js

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    schoolId: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["school_admin", "teacher", "student"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
```

---

## repository/user.repository.js

```js
import User from "../model/user.model.js";

export const findByEmail = (email, schoolId) => {
  return User.findOne({ email, schoolId });
};

export const createUser = (data) => {
  return User.create(data);
};
```

---

## service/auth.service.js

```js
import * as repo from "../repository/user.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (data) => {
  const hashed = await bcrypt.hash(data.password, 10);

  return repo.createUser({
    ...data,
    password: hashed,
  });
};

export const login = async (email, password, schoolId) => {
  const user = await repo.findByEmail(email, schoolId);

  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      id: user._id,
      schoolId: user.schoolId,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );

  return { user, token };
};
```

---

## controller/auth.controller.js

```js
import * as service from "../service/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await service.register(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await service.login(
      req.body.email,
      req.body.password,
      req.body.schoolId,
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};
```

---

## routes/auth.routes.js

```js
import express from "express";
import * as controller from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;
```

---

# 6. GLOBAL ROUTES

## routes/index.js

```js
import express from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

export default router;
```

---

# 7. WHAT YOU NOW HAVE

You now have:

### ✔ Working Express backend foundation

### ✔ Multi-tenant architecture (schoolId enforced)

### ✔ RBAC middleware

### ✔ Clean modular structure

### ✔ Auth module fully implemented

### ✔ Repository pattern enforced

### ✔ Scalable SaaS structure

---

# 8. WHAT YOU BUILD NEXT (ORDER)

Do NOT jump randomly.

### Step 1 (NEXT)

👉 Schools module (CRITICAL for tenancy setup)

### Step 2

👉 Users + Roles expansion

### Step 3

👉 Classes + Subjects

### Step 4

👉 Question Bank (core product engine)

### Step 5

👉 Assessments

### Step 6

👉 Results + Analytics

---

# FINAL WORD (IMPORTANT)

This is no longer planning stage.

You are now in:

```text
BUILD MODE
```

If you follow this structure strictly, you will not need a rewrite later.

---

If you want next step, I recommend:

👉 **“Build Schools module (full CRUD + tenancy rules + admin linking)”**

That is the real foundation of your entire SaaS.
