const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const ejs = require("ejs");
const timeCalc = require("./src/timeCalc");
let path = require("path");

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

const DB = mysql.createConnection({
  user: "root",
  password: "0000",
  database: "example",
});

app.get("/", function (req, res) {
  fs.readFile("./src/board.html", "utf-8", function (err, data) {
    DB.query("SELECT free_id, free_title, free_writer, free_writedate FROM free_board ORDER BY free_writedate DESC;", function (err, result) {
      res.send(ejs.render(data, { listData: result, t_f: timeCalc }));
    });
  });
});

app.get("/write", function (req, res) {
  fs.readFile("./src/write.html", "utf-8", function (err, data) {
    res.send(data);
  });
});

app.post("/write", function (req, res) {
  let { title, writer, password, content } = req.body;
  DB.query(
    "INSERT INTO free_board(free_title, free_writer, free_password, free_content,free_writedate) VALUE (?, ?, ?, ?, now())",
    [title, writer, password, content],
    function (err) {
      if (err) res.send(err);
      else res.redirect("/");
    }
  );
});

app.get("/page", function (req, res) {
  let { id } = req.query;
  fs.readFile("./src/page.html", "utf-8", function (err, data) {
    DB.query("SELECT free_id, free_title, free_writer, free_content, free_writedate FROM free_board WHERE free_id = ?", [id], function (err, result) {
      if (err) res.send(err);
      else res.send(ejs.render(data, { selected: result[0], t_f: timeCalc }));
    });
  });
});

app.post("/page", function (req, res) {
  let { id, password, flag } = req.body;
  if (+flag) {
    fs.readFile("./src/modify.html", "utf-8", function (err, data) {
      DB.query("SELECT free_title, free_writer, free_password, free_content FROM free_board WHERE free_id = ?", [id], function (err, result) {
        if (err) res.send(err);
        else {
          if (password == result[0].free_password) {
            res.send(ejs.render(data, { selected: result[0], id: id }));
          } else {
            fs.readFile("./src/wrong_info.html", "utf-8", function (err, data) {
              res.send(data);
            });
          }
        }
      });
    });
  } else {
    fs.readFile("./src/deletePage.html", "utf-8", function (err, data) {
      DB.query("SELECT free_title, free_writer, free_password, free_content FROM free_board WHERE free_id = ?", [id], function (err, result) {
        if (err) res.send(err);
        else {
          if (password == result[0].free_password) {
            res.send(ejs.render(data, { id: id }));
          } else {
            fs.readFile("./src/wrong_info.html", "utf-8", function (err, data) {
              res.send(data);
            });
          }
        }
      });
    });
  }
});

app.post("/update", function (req, res) {
  let { title, content, id } = req.body;
  DB.query("UPDATE free_board SET free_title = ?, free_content = ? WHERE free_id = ?", [title, content, id], function (err) {
    if (err) res.send(err);
    else {
      fs.readFile("./src/page.html", "utf-8", function (err, data) {
        DB.query("SELECT free_id, free_title, free_writer, free_content, free_writedate FROM free_board WHERE free_id = ?", [id], function (err, result) {
          if (err) res.send(err);
          else res.redirect("/");
        });
      });
    }
  });
});

app.get("/delete", function (req, res) {
  let { id } = req.query;
  DB.query("DELETE FROM free_board WHERE free_id = ?", [id], function (err) {
    if (err) res.send(err);
    else res.redirect("/");
  });
});

app.post("/page", function (req, res) {});

app.listen(8889, () => {
  console.log("server is running at 8889");
});
