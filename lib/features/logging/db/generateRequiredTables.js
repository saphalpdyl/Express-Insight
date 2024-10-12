import { 
  DATABASE_REQUEST_TABLE, 
  DATABASE_RESPONSE_TABLE,
  DATABASE_ERROR_TABLE
} from "../../../constants/index.js";

const TABLE_GENERATE_SQL = `
  CREATE TABLE ${DATABASE_REQUEST_TABLE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT UNIQUE NOT NULL,
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

  CREATE TABLE ${DATABASE_RESPONSE_TABLE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      status_code INTEGER,
      response_time INTEGER,
      content_type TEXT,
      content_length INTEGER,
      response_body TEXT,
      response_size FLOAT,
      
      FOREIGN KEY(request_id) REFERENCES request_logs(request_id)
  );

  CREATE TABLE ${DATABASE_ERROR_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    error_id TEXT UNIQUE NOT NULL,
    request_id TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    additional_info TEXT,
    
    FOREIGN KEY(request_id) REFERENCES ${DATABASE_REQUEST_TABLE}(request_id)
  );
`;

export function generateRequiredTables(db) {
  try {
    db.exec(TABLE_GENERATE_SQL);
    return true;
  } catch(e) {
    return false;
  }
}