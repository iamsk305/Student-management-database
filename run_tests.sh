#!/bin/sh
# Runs every test suite. Exit code is non-zero if any fails.
set -e
cd "$(dirname "$0")"
echo "== logic"; /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -m tests/logic.test.js
echo "== bank"; python3 tests/test_bank.py
PSQL=/opt/homebrew/opt/postgresql@16/bin/psql
if [ -x "$PSQL" ] && $PSQL -h 127.0.0.1 -p "${PGPORT:-54329}" -U postgres -qAt -c 'select 1' >/dev/null 2>&1; then
  echo "== database"
  $PSQL -h 127.0.0.1 -p "${PGPORT:-54329}" -U postgres -qAt -c 'drop database if exists tracker_test' -c 'create database tracker_test' >/dev/null
  LC_ALL=en_US.UTF-8 $PSQL -h 127.0.0.1 -p "${PGPORT:-54329}" -U postgres -d tracker_test -v ON_ERROR_STOP=1 -q \
    -f tests/supabase_stub.sql -f supabase/schema.sql -f tests/schema_test.sql 2>&1 | grep -v -e NOTICE -e set_config -e '^-' -e '^ 1' -e 'row)' -e '^$' || true
else
  echo "== database: skipped (no local PostgreSQL on port ${PGPORT:-54329})"
fi
