import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db= new pg.Client({
  user:"postgres",
  password:"pawar@abc",
  host:"localhost",
  port: 5432,
  database:"to do list"
})



db.connect()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", async (req, res) => {
  const todo_listitems = await db.query("select * from todolist ORDER BY id ASC;")
  const items = todo_listitems.rows
  res.render("index.ejs", {
    listItems:items,
    listTitle: "Today",
  });
  console.log(items)
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  await db.query("insert into todolist (title) values ($1)",[item])
  res.redirect("/");
});

app.post("/edit",async(req, res) => {
 const id=req.body.updatedItemId
  const listTitle = req.body.updatedItemTitle
  await db.query(`UPDATE todolist SET title = $1  WHERE id = $2`,
  [listTitle, id])
  res.redirect("/")
});

app.post("/delete", async (req, res) => {
  const removetask = req.body.deleteItemId
  await db.query("delete from todolist where id = $1",[removetask])
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
