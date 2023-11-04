const db = require("./db");
require("dotenv").config();

const selectOp = async (selectedCols, table, whereCols, values) => {
  try {
    let whereClause = "";
    if (whereCols?.length > 0) {
      if (whereCols.length === 1 && values.length > whereCols.length) {
        whereClause =
          `WHERE ${whereCols[0]} IN ` +
          "(" +
          values.map((col, index) => `$${index + 1}`).join(", ") +
          ")";
      } else {
        whereClause =
          "WHERE " +
          whereCols.map((col, index) => `${col} = $${index + 1}`).join(" AND ");
      }
    }
    const query = `SELECT ${selectedCols} FROM "${process.env.SCHEMA}".${table} ${whereClause}`;
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const insertOp = async (table, insertCols, values) => {
  try {
    let insertString = "";
    if (insertCols.length > 0) {
      insertString =
        "(" + insertCols.map((col, index) => `${col}`).join(", ") + ")";
    }
    let valueString = "";
    if (values.length > 0) {
      valueString =
        "(" + values.map((col, index) => `$${index + 1}`).join(", ") + ")";
    }
    const query = `INSERT INTO "${process.env.SCHEMA}".${table} ${insertString} VALUES ${valueString} RETURNING id`;
    const result = await db.query(query, values);
    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
};

const updateOp = async (
  table,
  updateCols,
  updateValues,
  whereCols,
  whereValue
) => {
  try {
    let setClause = "";
    if (updateCols?.length > 0) {
      setClause = updateCols
        .map((col, index) => `${col} = '${updateValues[index]}'`)
        .join(", ");
    }
    let whereClause = "";
    if (whereCols?.length > 1) {
      whereClause =
        "WHERE " +
        whereCols
          .map((col, index) => `${col} = ${whereValue[index]}`)
          .join(" AND ");
    } else {
      whereClause = "WHERE" + whereCol + " = " + whereValue;
    }
    const query = `UPDATE "${process.env.SCHEMA}".${table} SET ${setClause} ${whereClause}`;
    const result = await db.query(query);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const deleteOp = async (table, whereCols, values) => {
  try {
    let whereClause = "";
    if (whereCols?.length > 0) {
      if (whereCols.length === 1 && values.length > whereCols.length) {
        whereClause =
          `WHERE ${whereCols[0]} IN ` +
          "(" +
          values.map((col, index) => `$${index + 1}`).join(", ") +
          ")";
      } else {
        whereClause =
          "WHERE " +
          whereCols.map((col, index) => `${col} = $${index + 1}`).join(" AND ");
      }
    }
    const query = `DELETE FROM "${process.env.SCHEMA}".${table} ${whereClause}`;
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const customOp = async (customQuery) => {
  try {
    const query = customQuery;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { selectOp, insertOp, updateOp, deleteOp, customOp };
