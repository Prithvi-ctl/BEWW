import { Router } from "express";
import * as userController from "./users.controller"



const router = Router();

router.get('/me',userController.getProfile);
router.delete('/me',userController.removeProfile);
router.patch("/me",userController.profileUpdateHandler);


export default router;