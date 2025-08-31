
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/auth.js';
import { registerUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';
import { authenticate } from "../middlewares/authenticate.js";


const authRouter = Router();

authRouter.post(
    '/register',
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);


authRouter.post(
    '/login',
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController),
);

authRouter.post('/refresh', authenticate,
    ctrlWrapper(refreshUserSessionController));

authRouter.post('/logout', authenticate, ctrlWrapper(logoutUserController));

export default authRouter;