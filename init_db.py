import sys

import pymysql

from app.db import init_db


if __name__ == "__main__":
    try:
        init_db()
    except pymysql.MySQLError as exc:
        code = exc.args[0] if exc.args and isinstance(exc.args[0], int) else None
        if code in {2002, 2003}:
            message = "Cannot connect to MySQL. Start the MYSQL80 service and check DATABASE_URL host/port in .env."
        elif code == 1045:
            message = "MySQL rejected the configured credentials. Check the database username and password in .env."
        elif code == 1049:
            message = "The configured MySQL schema does not exist. Create the schema named in DATABASE_URL first."
        elif code == 1044:
            message = "The configured MySQL user cannot access this schema. Check its grants."
        else:
            message = "MySQL table setup failed. Check that MySQL is running and the .env database settings are correct."
        print(message, file=sys.stderr)
        raise SystemExit(1) from None
    print("Northstar MySQL tables are ready.")
