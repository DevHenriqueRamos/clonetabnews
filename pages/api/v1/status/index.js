import database from "../../../../infra/database.js";

export default async function status(request, response) {
  response.status(200).json({ chave: "são acima da média" });
}
