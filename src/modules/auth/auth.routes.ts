import { Router } from "express";
import type { RegisterInput } from "./auth.validation";
import * as authController from "./auth.controller"


const router = Router();


router.post(
    '/register',authController.RegistrationHandler
);

router.post(
    '/verify-email',authController.emailVerificationHandler
)

router.post('/resend-verification',authController.reEmailVerificationHandler)

router.post('/login',authController.loginHandler)
export default router;