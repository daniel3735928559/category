import panflute as pf
import yaml, sys, re, hashlib

node = {}
def get_id(node):
    return hashlib.sha256(node.encode()).hexdigest()

def action(elem, doc):
    global node
    if (isinstance(elem, pf.Code) or isinstance(elem, pf.CodeBlock)):
        if 'edges' in elem.classes:
            if not 'edges' in node: node['edges'] = {'has':{}, 'is':{}}
            for line in elem.text.split("\n"):
                m = re.match(r"^\s*has\s+([^:]*):\s*(.*)\s*$", line)
                et = 'has'
                if not m:
                    m = re.match(r"^\s*is\s+([^:]*) of:\s*(.*)\s*$", line)
                    et = 'is'
                    if not m:
                        sys.stderr.write("WARNING: Line not a valid edge: {}\n".format(line))
                        continue
                en = m.group(1)
                target = m.group(2)
                sys.stderr.write("EDGE: {} --{}--> {}\n".format(et,en,target))
                edges = node['edges'][et]
                if not en in edges: edges[en] = []
                edges[en].append(target)
            return []
        elif 'info' in elem.classes:
            data = yaml.load(elem.text)
            if not 'name' in data:
                sys.stderr.write("WARNING: 'name' required in info\n")
                return []
            node['name'] = data['name']
            sys.stderr.write("NODE: {}\n".format(node['name']))
            return []

def main(doc=None):
    global node
    doc = pf.load()
    ans = pf.run_filter(action, doc=doc)
    ID = get_id(node['name'])
    with open("metadata.yaml","a") as f:
        f.write(str(yaml.dump({ID:node})))
    print(ID)
    exit(1)

if __name__ == '__main__':
    main()
