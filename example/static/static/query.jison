
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+			          /* skip whitespace */
"*"         			  return '*'
"/"                    		  return '/'
";"                    		  return ';'
":"                    		  return ':'
","                    		  return ','
"("                    		  return '('
")"                    		  return ')'
"has"		       		  return 'HAS'
"is"		       		  return 'IS'
"of"		       		  return 'OF'
"c"		       	      	  return 'C'
(?!has)(?!of)[^*/;:,() ]+         return 'STR'
<<EOF>>                	       	  return 'EOF'
.                      		  return 'INVALID'

/lex

/* operator associations and precedence */

%start query

%% /* language grammar */

query
    : qs EOF
        { return $1; }
    ;
    
qs
    : q
        { $$ = $1; }
    | q ',' andq
        {$$ = ["and",[$1].concat($3)];}
    | q '/' orq
        {$$ = ["or",[$1].concat($3)];}
    ;


q
    : name
        {$$ = ["name",$1];}
    | HAS name
        {$$ = ["edge",{"name":$2,"dir":"has"}];}
    | IS name
        {$$ = ["edge",{"name":$2,"dir":"is"}];}
    | HAS name ':' q
        {$$ = ["edge",{"name":$2,"dir":"has","query":$4}];}
    | name OF ':' q
        {$$ = ["edge",{"name":$1,"dir":"is","query":$4}];}
    | '(' qs ')'
        {$$ = $2;}
    ;

andq
    : andq ',' q
        {$$ = $1.concat($3);}
    | q
        {$$ = [$1];}
    ;
    
orq
    : orq '/' q
        {$$ = $1.concat($3);}
    | q
        {$$ = [$1];}
    ;

name
    : words
        {$$ = $1;}
    | '*'
        {$$ = "*";}
    ;

words
    : words STR
        {$$ = $1 +" "+ $2;}
    | STR
        {$$ = $1}
    ;