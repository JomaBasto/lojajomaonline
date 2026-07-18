import fs from "fs";

const produtos = JSON.parse(
  fs.readFileSync("produtos_backup_atual.json", "utf8")
);

console.log(JSON.stringify(produtos[0], null, 2));