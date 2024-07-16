use rusqlite::{Connection, Result, params};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

pub struct DbConn {
    conn: Mutex<Connection>,
}

impl DbConn {
    pub fn new() -> Result<Self> {
        let conn = Connection::open("data.db")?;
        Ok(DbConn { conn: Mutex::new(conn) })
    }

    pub fn init(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "CREATE TABLE IF NOT EXISTS apps (
                name TEXT PRIMARY KEY,
                previous_run_time INTEGER,
                current_run_time INTEGER,
                allowed_run_time INTEGER
            )",
            [],
        )?;
        Ok(())
    }

    pub fn init_hashmap(&self, data: Arc<Mutex<HashMap<String, [u64; 3]>>>) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT name, previous_run_time, current_run_time, allowed_run_time FROM apps")?;
        let mut data = data.lock().unwrap();
        let rows = stmt.query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?,
                [
                    row.get::<_, u64>(1)?,
                    row.get::<_, u64>(2)?,
                    row.get::<_, u64>(3)?
                ]
            ))
        })?;
        for row in rows {
            let (name, times) = row?;
            data.insert(name, times);
        }
        Ok(())
    }

    pub fn add_app(&self, name: &str, allowed_time: u64) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO apps (name, previous_run_time, current_run_time, allowed_run_time) VALUES (?1, 0, 0, ?2)",
            params![name, allowed_time],
        )?;
        Ok(())
    }

    pub fn remove_app(&self, name: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM apps WHERE name = ?1", params![name])?;
        Ok(())
    }

    pub fn edit_app(&self, name: &str, allowed_time: u64) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "UPDATE apps SET allowed_run_time = ?1 WHERE name = ?2",
            params![allowed_time, name],
        )?;
        Ok(())
    }
}