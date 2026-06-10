const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const bcrypt = require("bcrypt");

const upload = multer({ dest: "uploads/" });

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "outstaff_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

const util = require("util");
// Convert db.query to promise
const query = util.promisify(db.query).bind(db);

/* ================= LOGIN ================= */

// app.post("/login", (req, res) => {
//   const { email, password, type } = req.body;

//   if (!email || !password || !type) {
//     return res.json({ status: "error", message: "Missing fields" });
//   }

//   const table = type === "admin" ? "admins" : "users";

//   db.query(
//     `SELECT * FROM ${table} WHERE email = ?`,
//     [email],
//     (err, result) => {
//       if (err) return res.json({ status: "error", message: "Server error" });

//       if (result.length === 0)
//         return res.json({ status: "error", message: "Account not found" });

//       const account = result[0];

//       if (account.password !== password)
//         return res.json({ status: "error", message: "Invalid password" });

//       db.query(
//         "SELECT * FROM menu_permissions WHERE user_id = ?",
//         [account.id],
//         (permErr, permissions) => {
//           if (permErr)
//             return res.json({ status: "error", message: "Permission error" });

//           res.json({
//             status: "success",
//             user: {
//               id: account.id,
//               name: account.name,
//               role: type,
//             },
//             permissions: permissions,
//           });
//         }
//       );
//     }
//   );
// });

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  const { email, password, type } = req.body;

  if (!email || !password || !type) {
    return res.json({ status: "error", message: "Missing fields" });
  }

  // EMAIL VALIDATION
  if (!email.includes("@")) {
    return res.json({
      status: "error",
      message: "Invalid email format",
    });
  }

  const table = type === "admin" ? "admins" : "users";

  db.query(
    `SELECT * FROM ${table} WHERE email = ?`,
    [email],
    async (err, result) => {
      if (err) {
        console.log("Login DB Error:", err);
        return res.json({ status: "error", message: "Server error" });
      }

      if (result.length === 0) {
        return res.json({
          status: "error",
          message: "Account not found",
        });
      }

      const account = result[0];

      // ✅ BCRYPT PASSWORD CHECK
      const passwordMatch = await bcrypt.compare(password, account.password);

      if (!passwordMatch) {
        return res.json({
          status: "error",
          message: "Invalid password",
        });
      }

      db.query(
        "SELECT * FROM menu_permissions WHERE user_id = ?",
        [account.id],
        (permErr, permissions) => {
          if (permErr) {
            return res.json({
              status: "error",
              message: "Permission error",
            });
          }

          res.json({
            status: "success",
            user: {
              id: account.id,
              name: account.name,
              role: type,
            },
            permissions: permissions,
          });
        }
      );
    }
  );
});

/* ================= ADMIN STATS ================= */

app.get("/admin-stats", async (req, res) => {
  try {
    // MAIN STATS
    const stats = await query(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(DATE(created_at) = CURDATE() - INTERVAL 1 DAY) as yesterday,
        SUM(created_at >= CURDATE() - INTERVAL 7 DAY) as last7Days,
        SUM(created_at >= CURDATE() - INTERVAL 30 DAY) as last30Days
      FROM users
    `);

    // WEEKLY REGISTRATIONS
    const weekly = await query(`
      SELECT 
        DAYNAME(created_at) as day,
        COUNT(*) as users
      FROM users
      WHERE created_at >= CURDATE() - INTERVAL 7 DAY
      GROUP BY DAYNAME(created_at)
    `);

    // MONTHLY REGISTRATIONS
    const monthly = await query(`
      SELECT 
        MONTHNAME(created_at) as month,
        COUNT(*) as users
      FROM users
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
    `);

    // RECENT USERS
    const recent = await query(`
      SELECT id, name, email, contact, created_at
      FROM users
      ORDER BY id DESC
      LIMIT 5
    `);

    res.json({
      stats: stats[0],
      weekly,
      monthly,
      users: recent,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= USERS ================= */

app.get("/users", (req, res) => {
  const sql = `
    SELECT id, name, email, contact, created_at
    FROM users
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ status: "error", error: err });

    res.json({
      status: "success",
      users: result,
    });
  });
});

app.get("/all-users", (req, res) => {
  const sql = `
    SELECT id, name, email, contact, created_at
    FROM users
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ status: "error", error: err });

    res.json(result);
  });
});

// app.post("/add-user", (req, res) => {
//   const { name, email, password, contact } = req.body;

//   const sql = `
//     INSERT INTO users (name, email, password, contact, created_at)
//     VALUES (?, ?, ?, ?, NOW())
//   `;

//   db.query(sql, [name, email, password, contact], (err) => {
//     if (err)
//       return res.status(500).json({ status: "error", error: err });

//     res.json({ status: "success" });
//   });
// });

app.post("/add-user", async (req, res) => {
  const { name, email, password, contact } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const sql = `
    INSERT INTO users (name, email, password, contact, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [name, email, hashedPassword, contact], (err) => {
    if (err) return res.status(500).json({ status: "error", error: err });

    res.json({ status: "success" });
  });
});

app.put("/update-user/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, contact } = req.body;

  const sql = `
    UPDATE users 
    SET name = ?, email = ?, contact = ?
    WHERE id = ?
  `;

  db.query(sql, [name, email, contact, id], (err) => {
    if (err) return res.status(500).json({ status: "error", error: err });

    res.json({ status: "success" });
  });
});

app.delete("/delete-user/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ status: "error", error: err });

    res.json({ status: "success" });
  });
});

/* ================= PERMISSIONS ================= */

app.get("/all-users-basic", (req, res) => {
  db.query(
    "SELECT id, name, email FROM users ORDER BY id DESC",
    (err, result) => {
      if (err) return res.status(500).json({ status: "error" });
      res.json(result);
    },
  );
});

app.get("/user-permissions/:userId", (req, res) => {
  db.query(
    "SELECT * FROM menu_permissions WHERE user_id = ?",
    [req.params.userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json(result);
    },
  );
});

app.post("/save-permissions", (req, res) => {
  const { userId, permissions } = req.body;

  db.query(
    "DELETE FROM menu_permissions WHERE user_id = ?",
    [userId],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      if (!permissions.length) return res.json({ status: "success" });

      const values = permissions.map((p) => [
        userId,
        p.menu_key,
        p.can_active,
        p.can_add,
        p.can_edit,
        p.can_delete,
        p.can_print,
      ]);

      db.query(
        `
        INSERT INTO menu_permissions
        (user_id, menu_key, can_active, can_add, can_edit, can_delete, can_print)
        VALUES ?
        `,
        [values],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ status: "success" });
        },
      );
    },
  );
});

/* employee master */
app.get("/employees", (req, res) => {
  const sql = `
    SELECT e.*,
           d.department_name,
           ds.designation_name,
           v.vendor_name
    FROM employee_master e
    LEFT JOIN department_table d 
      ON e.department_id = d.department_id
    LEFT JOIN designation_table ds 
      ON e.designation_id = ds.designation_id
    LEFT JOIN vendor_table v 
      ON e.vendor_id = v.vendor_id
    ORDER BY e.employee_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/add-employee", (req, res) => {
  const {
    employee_code,
    employee_name,
    father_name,
    department_id,
    designation_id,
    vendor_id,
    contact,
    status,
  } = req.body;

  const sql = `
    INSERT INTO employee_master
    (
      employee_code,
      employee_name,
      father_name,
      department_id,
      designation_id,
      vendor_id,
      contact,
      status,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [
      employee_code,
      employee_name,
      father_name,
      department_id,
      designation_id,
      vendor_id,
      contact,
      status === "Active" ? 1 : 0,
    ],
    (err, result) => {
      if (err) {
        console.log("Insert error:", err); // 👈 IMPORTANT
        return res.status(500).json(err);
      }
      res.json({ message: "Employee added successfully" });
    },
  );
});

app.put("/update-employee/:id", (req, res) => {
  const { id } = req.params;

  const {
    employee_code,
    employee_name,
    father_name,
    department_id,
    designation_id,
    vendor_id,
    contact,
    status,
  } = req.body;

  const sql = `
    UPDATE employee_master
    SET
      employee_code = ?,
      employee_name = ?,
      father_name = ?,
      department_id = ?,
      designation_id = ?,
      vendor_id = ?,
      contact = ?,
      status = ?
    WHERE employee_id = ?
  `;

  db.query(
    sql,
    [
      employee_code,
      employee_name,
      father_name,
      department_id,
      designation_id,
      vendor_id,
      contact,
      status === "Active" ? 1 : 0,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log("Update error:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Employee updated successfully" });
    },
  );
});

app.delete("/delete-employee/:id", (req, res) => {
  db.query(
    "DELETE FROM employee_master WHERE employee_id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ status: "success" });
    },
  );
});

app.get("/departments", (req, res) => {
  db.query(
    "SELECT department_id, department_name FROM department_table WHERE status=1",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});

app.get("/designations", (req, res) => {
  db.query(
    "SELECT designation_id, designation_name FROM designation_table WHERE status=1",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});

app.get("/item-groups", (req, res) => {
  const sql = `
    SELECT item_group_id, item_group_name
    FROM item_group_master
    WHERE status = 1
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/item-processes", (req, res) => {
  const sql = `
    SELECT item_process_id, item_process_name
    FROM item_process_master
    WHERE status = 1
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/items", (req, res) => {
  const sql = `
    SELECT 
      i.*,
      g.item_group_name,
      p.item_process_name
    FROM item_master i
    LEFT JOIN item_group_master g
      ON i.item_group_id = g.item_group_id
    LEFT JOIN item_process_master p
      ON i.item_process_id = p.item_process_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/add-item", (req, res) => {
  const {
    item_code,
    item_name,
    item_rate,
    item_group_id,
    item_process_id,
    status,
  } = req.body;

  const sql = `
    INSERT INTO item_master
    (
      item_code,
      item_name,
      item_rate,
      item_group_id,
      item_process_id,
      status,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [
      item_code,
      item_name,
      item_rate,
      item_group_id,
      item_process_id,
      status === "Active" ? 1 : 0,
    ],
    (err, result) => {
      if (err) {
        console.log("Item Insert Error:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Item added successfully" });
    },
  );
});

app.put("/update-item/:id", (req, res) => {
  const { id } = req.params;

  const {
    item_code,
    item_name,
    item_rate,
    item_group_id,
    item_process_id,
    status,
  } = req.body;

  const sql = `
    UPDATE item_master
    SET
      item_code = ?,
      item_name = ?,
      item_rate = ?,
      item_group_id = ?,
      item_process_id = ?,
      status = ?
    WHERE item_id = ?
  `;

  db.query(
    sql,
    [
      item_code,
      item_name,
      item_rate,
      item_group_id,
      item_process_id,
      status === "Active" ? 1 : 0,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log("Item Update Error:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Item updated successfully" });
    },
  );
});

app.delete("/delete-item/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM item_master
    WHERE item_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Item Delete Error:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Item deleted successfully" });
  });
});

/* ==============================
   GET ALL VENDORS
============================== */
app.get("/vendors", (req, res) => {
  const sql = `
    SELECT 
      vendor_id,
      vendor_code,
      vendor_name,
      gst_number,
      address,
      mobile,
      email,
      status,
      created_at
    FROM vendor_table
    ORDER BY vendor_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Vendor Fetch Error:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

/* ==============================
   ADD VENDOR
============================== */
app.post("/add-vendor", (req, res) => {
  const {
    vendor_code,
    vendor_name,
    gst_number,
    address,
    mobile,
    email,
    status,
  } = req.body;

  const sql = `
    INSERT INTO vendor_table
    (
      vendor_code,
      vendor_name,
      gst_number,
      address,
      mobile,
      email,
      status,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [
      vendor_code,
      vendor_name,
      gst_number,
      address,
      mobile,
      email,
      status === "Active" ? 1 : 0,
    ],
    (err, result) => {
      if (err) {
        console.log("Vendor Insert Error:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Vendor added successfully" });
    },
  );
});

/* ==============================
   UPDATE VENDOR
============================== */
app.put("/update-vendor/:id", (req, res) => {
  const { id } = req.params;

  const {
    vendor_code,
    vendor_name,
    gst_number,
    address,
    mobile,
    email,
    status,
  } = req.body;

  const sql = `
    UPDATE vendor_table
    SET
      vendor_code = ?,
      vendor_name = ?,
      gst_number = ?,
      address = ?,
      mobile = ?,
      email = ?,
      status = ?
    WHERE vendor_id = ?
  `;

  db.query(
    sql,
    [
      vendor_code,
      vendor_name,
      gst_number,
      address,
      mobile,
      email,
      status === "Active" ? 1 : 0,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log("Vendor Update Error:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Vendor updated successfully" });
    },
  );
});

/* ==============================
   DELETE VENDOR
============================== */
app.delete("/delete-vendor/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM vendor_table
    WHERE vendor_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Vendor Delete Error:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Vendor deleted successfully" });
  });
});

app.get("/item-processes-all", (req, res) => {
  db.query(
    "SELECT * FROM item_process_master ORDER BY item_process_id DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});

/* ================= GROUP MASTER ================= */

// GET ALL GROUPS (for master page)
app.get("/item-groups-all", (req, res) => {
  const sql = `
    SELECT *
    FROM item_group_master
    ORDER BY item_group_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Group Fetch Error:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// ADD GROUP
app.post("/add-group", (req, res) => {
  const { item_group_name, status } = req.body;

  const sql = `
    INSERT INTO item_group_master
    (item_group_name, status, created_at)
    VALUES (?, ?, NOW())
  `;

  db.query(sql, [item_group_name, status === "Active" ? 1 : 0], (err) => {
    if (err) {
      console.log("Group Insert Error:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Group added successfully" });
  });
});

// UPDATE GROUP
app.put("/update-group/:id", (req, res) => {
  const { id } = req.params;
  const { item_group_name, status } = req.body;

  const sql = `
    UPDATE item_group_master
    SET item_group_name = ?, status = ?
    WHERE item_group_id = ?
  `;

  db.query(sql, [item_group_name, status === "Active" ? 1 : 0, id], (err) => {
    if (err) {
      console.log("Group Update Error:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Group updated successfully" });
  });
});

// DELETE GROUP
app.delete("/delete-group/:id", (req, res) => {
  db.query(
    "DELETE FROM item_group_master WHERE item_group_id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.log("Group Delete Error:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Group deleted successfully" });
    },
  );
});

app.post("/add-process", (req, res) => {
  const { item_process_name, status } = req.body;

  const sql = `
    INSERT INTO item_process_master
    (item_process_name, status, created_at)
    VALUES (?, ?, NOW())
  `;

  db.query(sql, [item_process_name, status === "Active" ? 1 : 0], (err) => {
    if (err) {
      console.log("Process Insert Error:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Process added successfully" });
  });
});

app.get("/production/:date", (req, res) => {
  const { date } = req.params;

  const sql = `
    SELECT 
      p.production_id,
      p.production_date,
      p.employee_code,
      e.employee_name,
      p.item_code,
      i.item_name,
      i.item_rate,
      p.qty,
      (i.item_rate * p.qty) AS total
    FROM production_table p
    LEFT JOIN employee_master e 
      ON p.employee_code = e.employee_code
    LEFT JOIN item_master i
      ON p.item_code = i.item_code
    WHERE p.production_date = ?
  `;

  db.query(sql, [date], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/save-production", (req, res) => {
  const { production_date, rows } = req.body;

  const values = rows.map((r) => [
    production_date,
    r.employee_code,
    r.item_code,
    r.qty,
  ]);

  const sql = `
    INSERT INTO production_table
    (production_date, employee_code, item_code, qty)
    VALUES ?
  `;

  db.query(sql, [values], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Production saved successfully" });
  });
});

app.get("/employee-by-code/:code", (req, res) => {
  db.query(
    "SELECT employee_name FROM employee_master WHERE employee_code = ?",
    [req.params.code],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0] || null);
    },
  );
});

app.get("/item-by-code/:code", (req, res) => {
  db.query(
    "SELECT item_name, item_rate FROM item_master WHERE item_code = ?",
    [req.params.code],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0] || null);
    },
  );
});

app.get("/employees-all", (req, res) => {
  db.query(
    "SELECT employee_code, employee_name FROM employee_master WHERE status=1",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});

app.get("/items-all", (req, res) => {
  db.query(
    "SELECT item_code, item_name, item_rate FROM item_master WHERE status=1",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});

/* ================= PRODUCTION SUMMARY ================= */

app.get("/production-list", (req, res) => {
  const sql = `
    SELECT 
      p.production_id,
      p.production_date,
      p.employee_code,
      e.employee_name,
      p.item_code,
      i.item_name,
      i.item_rate,
      p.qty,
      (i.item_rate * p.qty) AS total
    FROM production_table p
    LEFT JOIN employee_master e 
      ON p.employee_code = e.employee_code
    LEFT JOIN item_master i
      ON p.item_code = i.item_code
    ORDER BY p.production_date DESC, p.production_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.delete("/production-date/:date", (req, res) => {
  db.query(
    "DELETE FROM production_table WHERE production_date = ?",
    [req.params.date],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    },
  );
});

app.delete("/delete-production/:id", (req, res) => {
  db.query(
    "DELETE FROM production_table WHERE production_id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted successfully" });
    },
  );
});

app.get("/production-by-date/:date", (req, res) => {
  const sql = `
    SELECT 
      p.production_id,
      p.production_date,
      p.employee_code,
      e.employee_name,
      p.item_code,
      i.item_name,
      i.item_rate,
      p.qty
    FROM production_table p
    LEFT JOIN employee_master e 
      ON p.employee_code = e.employee_code
    LEFT JOIN item_master i
      ON p.item_code = i.item_code
    WHERE p.production_date = ?
  `;

  db.query(sql, [req.params.date], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.put("/update-production", (req, res) => {
  const { rows } = req.body;

  if (!rows || rows.length === 0) {
    return res.status(400).json({ message: "No rows" });
  }

  const updatePromises = rows.map((r) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE production_table
        SET employee_code = ?, item_code = ?, qty = ?
        WHERE production_id = ?
      `;

      db.query(
        sql,
        [r.employee_code, r.item_code, r.qty, r.production_id],
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });
  });

  Promise.all(updatePromises)
    .then(() => res.json({ message: "Updated Successfully" }))
    .catch((err) => res.status(500).json(err));
});

app.get("/employees-all", (req, res) => {
  db.query("SELECT * FROM employee_master", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/items-all", (req, res) => {
  db.query("SELECT * FROM item_master", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/upload-production", upload.single("file"), async (req, res) => {
  const { production_date } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      return res.status(400).json({ message: "File is empty" });
    }

    const values = [];

    for (let row of data) {
      if (!row.employee_code || !row.item_code || !row.qty) {
        return res.status(400).json({
          message: "Invalid file format. Missing required columns.",
        });
      }

      values.push([production_date, row.employee_code, row.item_code, row.qty]);
    }

    const sql = `
      INSERT INTO production_table
      (production_date, employee_code, item_code, qty)
      VALUES ?
    `;

    db.query(sql, [values], (err) => {
      if (err) {
        console.log("Upload error:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Production uploaded successfully" });
    });
  } catch (err) {
    console.log("File read error:", err);
    res.status(500).json({ message: "File processing failed" });
  }
});

app.get("/report/item-wise", (req, res) => {
  const { item_code, from_date, to_date } = req.query;

  const sql = `
    SELECT 
      p.production_date,
      i.item_name,
      e.employee_name,
      p.qty,
      i.item_rate AS price,
      (p.qty * i.item_rate) AS amount
    FROM production_table p
    LEFT JOIN item_master i 
      ON p.item_code = i.item_code
    LEFT JOIN employee_master e 
      ON p.employee_code = e.employee_code
    WHERE p.item_code = ?
      AND p.production_date BETWEEN ? AND ?
    ORDER BY p.production_date ASC
  `;

  db.query(sql, [item_code, from_date, to_date], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/report/employee-wise", (req, res) => {
  const { employee_code, from_date, to_date } = req.query;

  if (!employee_code || !from_date || !to_date) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const sql = `
    SELECT 
      p.production_date,
      e.employee_name,
      i.item_name,
      p.qty,
      i.item_rate AS price,
      (p.qty * i.item_rate) AS amount
    FROM production_table p
    LEFT JOIN employee_master e 
      ON p.employee_code = e.employee_code
    LEFT JOIN item_master i 
      ON p.item_code = i.item_code
    WHERE p.employee_code = ?
      AND p.production_date BETWEEN ? AND ?
    ORDER BY p.production_date ASC
  `;

  db.query(sql, [employee_code, from_date, to_date], (err, result) => {
    if (err) {
      console.log("Employee Report Error:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

app.get("/report/vendor-wise", (req, res) => {
  const { vendor_id, from_date, to_date } = req.query;

  if (!vendor_id || !from_date || !to_date) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const sql = `
    SELECT 
      p.production_date,
      v.vendor_name,
      e.employee_name,
      i.item_name,
      p.qty,
      i.item_rate AS price,
      (p.qty * i.item_rate) AS amount
    FROM production_table p
    LEFT JOIN employee_master e 
      ON p.employee_code = e.employee_code
    LEFT JOIN vendor_table v 
      ON e.vendor_id = v.vendor_id
    LEFT JOIN item_master i 
      ON p.item_code = i.item_code
    WHERE v.vendor_id = ?
      AND p.production_date BETWEEN ? AND ?
    ORDER BY p.production_date ASC
  `;

  db.query(sql, [vendor_id, from_date, to_date], (err, result) => {
    if (err) {
      console.log("Vendor Report Error:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

app.get("/report/salary", (req, res) => {
  const { type, vendor_id, employee_code, month } = req.query;

  if (!type || !month) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const startDate = `${month}-01`;
  const endDate = `${month}-31`;

  let sql = "";
  let params = [];

  // ================= VENDOR WISE =================
  if (type === "vendor") {
    sql = `
      SELECT 
        i.item_name,
        SUM(p.qty) as qty,
        i.item_rate as price,
        SUM(p.qty * i.item_rate) as amount
      FROM production_table p
      JOIN item_master i ON p.item_code = i.item_code
      JOIN employee_master e ON p.employee_code = e.employee_code
      WHERE e.vendor_id = ?
        AND p.production_date BETWEEN ? AND ?
      GROUP BY i.item_name, i.item_rate
    `;
    params = [vendor_id, startDate, endDate];
  }

  // ================= EMPLOYEE WISE =================
  else if (type === "employee") {
    sql = `
      SELECT 
        i.item_name,
        SUM(p.qty) as qty,
        i.item_rate as price,
        SUM(p.qty * i.item_rate) as amount
      FROM production_table p
      JOIN item_master i ON p.item_code = i.item_code
      WHERE p.employee_code = ?
        AND p.production_date BETWEEN ? AND ?
      GROUP BY i.item_name, i.item_rate
    `;
    params = [employee_code, startDate, endDate];
  }

  // ================= VENDOR WISE EMPLOYEE =================
  else if (type === "vendor-employee") {
    sql = `
      SELECT 
        i.item_name,
        e.employee_name,
        SUM(p.qty) as qty,
        v.vendor_name,
        i.item_rate as price,
        SUM(p.qty * i.item_rate) as amount
      FROM production_table p
      JOIN item_master i ON p.item_code = i.item_code
      JOIN employee_master e ON p.employee_code = e.employee_code
      JOIN vendor_table v ON e.vendor_id = v.vendor_id
      WHERE e.vendor_id = ?
        AND p.production_date BETWEEN ? AND ?
      GROUP BY i.item_name, e.employee_name, v.vendor_name, i.item_rate
    `;
    params = [vendor_id, startDate, endDate];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/dashboard-summary", async (req, res) => {
  try {
    const totalProduction = await query(`
      SELECT IFNULL(SUM(qty),0) as totalQty 
      FROM production_table
    `);

    const totalRevenue = await query(`
      SELECT IFNULL(SUM(p.qty * i.item_rate),0) as totalRevenue
      FROM production_table p
      JOIN item_master i ON p.item_code = i.item_code
    `);

    const totalEmployees = await query(`
      SELECT COUNT(*) as totalEmployees
      FROM employee_master
    `);

    const totalVendors = await query(`
      SELECT COUNT(*) as totalVendors
      FROM vendor_table
    `);

    const monthlyProduction = await query(`
      SELECT 
        MONTH(production_date) as month,
        SUM(qty) as qty
      FROM production_table
      GROUP BY MONTH(production_date)
    `);

    const recentProduction = await query(`
      SELECT 
        p.production_date,
        p.employee_code as employee_name,
        p.item_code as item_name,
        p.qty,
        (p.qty * i.item_rate) as amount
      FROM production_table p
      JOIN item_master i ON p.item_code = i.item_code
      ORDER BY p.production_id DESC
      LIMIT 5
    `);

    const topItems = await query(`
      SELECT item_code as item_name, SUM(qty) as qty
      FROM production_table
      GROUP BY item_code
      ORDER BY qty DESC
      LIMIT 5
    `);

    const employeeContribution = await query(`
      SELECT employee_code as employee_name, SUM(qty) as qty
      FROM production_table
      GROUP BY employee_code
    `);

    const masterCounts = await query(`
      SELECT
        (SELECT COUNT(*) FROM employee_master) as employees,
        (SELECT COUNT(*) FROM item_master) as items,
        (SELECT COUNT(*) FROM vendor_table) as vendors
    `);

    res.json({
      totalProduction,
      totalRevenue,
      totalEmployees,
      totalVendors,
      monthlyProduction,
      recentProduction,
      topItems,
      employeeContribution,
      masterCounts,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// LOGOUT

app.post("/logout", (req, res) => {
  const { user_id } = req.body;

  const findSql = `
    SELECT id
    FROM logs
    WHERE user_id = ?
    AND out_time IS NULL
    ORDER BY id DESC
    LIMIT 1
  `;

  db.query(findSql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.json({ message: "No active session found" });
    }

    const logId = result[0].id;

    const updateSql = `
      UPDATE logs
      SET out_time = NOW(), flag='O'
      WHERE id = ?
    `;

    db.query(updateSql, [logId], (err2) => {
      if (err2) return res.status(500).json(err2);

      res.json({ status: "success" });
    });
  });
});



app.get("/admin/users", (req, res) => {

  const sql = `
    SELECT id, name, email
    FROM users
    ORDER BY name ASC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });

});

app.get("/admin/users", (req, res) => {

  const sql = `
    SELECT id, name, email
    FROM users
    ORDER BY name ASC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });

});

app.get("/admin/user-logs/:id", (req, res) => {

  const userId = req.params.id;

  const sql = `
    SELECT
      id,
      in_time,
      out_time,
      flag
    FROM logs
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT 6
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });

});

app.get("/admin/all-logs/:id", (req, res) => {

  const userId = req.params.id;

  const sql = `
    SELECT
      id,
      in_time,
      out_time,
      flag
    FROM logs
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });

});



/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
