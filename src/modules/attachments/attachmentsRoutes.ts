import { Router } from "express";
import { create, destroy, findByTicketId } from "./attachmentsAction.js";

const router = Router();

router.post("/:id", create);
router.get("/:id", findByTicketId);
router.delete("/:id", destroy);

export default router;
