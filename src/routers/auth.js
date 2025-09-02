
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/auth.js';
import { registerUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';
import { requireSessionCookies } from '../middlewares/requireSessionCookies.js';
import { sendResetEmailSchema } from '../validation/auth.js';
import { sendResetEmailController } from '../controllers/auth.js';



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

authRouter.post('/refresh', requireSessionCookies, ctrlWrapper(refreshUserSessionController));

authRouter.post('/logout', requireSessionCookies, ctrlWrapper(logoutUserController));

authRouter.post(
    '/send-reset-email',
    validateBody(sendResetEmailSchema),
    ctrlWrapper(sendResetEmailController),
);

export default authRouter;