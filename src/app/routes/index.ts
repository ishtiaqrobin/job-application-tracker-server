import { Router } from "express";

import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.route";
import { ContactRouter } from "../modules/contact/contact.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/contacts", ContactRouter);

export const IndexRoutes = router;
