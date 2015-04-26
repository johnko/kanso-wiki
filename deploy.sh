#!/bin/sh

DBNAME=tapir
DBURL=http://localhost:5984/${DBNAME}

kanso install
kanso push ${DBURL}
kanso upload data ${DBURL}
