import panflute as pf
import yaml, sys

def action(elem, doc):
    if (isinstance(elem, pf.Code) or isinstance(elem, pf.CodeBlock)):
        if 'edges' in elem.classes or 'info' in elem.classes:
            return []

def main(doc=None):
    return pf.run_filter(action, doc=doc)

if __name__ == '__main__':
    main()
