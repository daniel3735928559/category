
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
(?!has)(?!of)[^*;:() ]+          return 'STR'
<<EOF>>                	       	  return 'EOF'
.                      		  return 'INVALID'

/lex

/* operator associations and precedence */

%start query

%% /* language grammar */

query
    : q EOF
        { return $1; }
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
    | '(' q ')'
        {$$ = $2;}
    | q ',' q
        {$$ = ["and",[$1, $3]];}
    | q '/' q
        {$$ = ["or",[$1, $3]];}
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