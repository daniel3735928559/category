"""Usage: n4j.py <md_file> <un> <pw>"""

from neo4j import GraphDatabase
import json, sys, docopt, time

args = docopt.docopt(__doc__)

nodes_import = """with {md} as metadata
UNWIND keys(metadata) AS node
MERGE (n:Node {id:node, name:metadata[node].name})"""

edges_import = """with {md} as metadata
UNWIND keys(metadata) AS node
UNWIND keys(metadata[node].edges.has) AS edge
UNWIND metadata[node].edges.has[edge] AS dest
MATCH (src:Node {id:node}),(tgt:Node {id:dest}) MERGE (src)-[:HAS {label:edge}]->(tgt) MERGE (tgt)-[:IS {label:edge}]->(src)"""

def run(tx, q, md):
    tx.run(q, md=md)

with open(args['<md_file>'],"r") as f: s = f.read()
s = json.loads(s)

print(args)

driver = GraphDatabase.driver("bolt://localhost:7687", auth=(args['<un>'],args['<pw>']))

with driver.session() as session:
    session.read_transaction(run, nodes_import, s)
    session.read_transaction(run, edges_import, s)
