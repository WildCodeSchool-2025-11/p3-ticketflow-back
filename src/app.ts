import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";

const app = express();

app.use(cors());
app.use(express.json());

// Activation de express-fileupload
app.use(
	fileUpload({
		createParentPath: true,
	}),
);

// Exemple de route racine
app.get("/", (req, res) => {
	res.send("API running");
});

export default app;
