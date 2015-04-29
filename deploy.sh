#!/bin/sh

DBNAME=tapirwiki
DBURL=http://localhost:5984/${DBNAME}

kanso install

kanso push ${DBURL}
