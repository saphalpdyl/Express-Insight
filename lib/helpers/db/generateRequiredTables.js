const TABLE_GENERATE_SQL = `
  CREATE TABLE request_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      method TEXT NOT NULL,
      url TEXT NOT NULL,
      client_ip TEXT NOT NULL,
      user_agent TEXT,
      content_type TEXT,
      referer TEXT,
      x_forwarded_for TEXT,
      query_params TEXT,
      request_body TEXT
  );

  CREATE TABLE response_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      status_code INTEGER,
      response_time INTEGER,
      content_type TEXT,
      content_length INTEGER,
      response_body TEXT,
      
      FOREIGN KEY(request_id) REFERENCES request_logs(id)
  );
`;

export function generateRequiredTables(db) {
  db.exec(TABLE_GENERATE_SQL);
}