import { app } from "@/app";
import { AppError } from "./utils/AppError";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
