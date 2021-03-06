
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+			          /* skip whitespace */
"!"         			  return '!'
(?!"==")"="         			  return '='
"-"                               return '-'
"*"         			  return '*'
"/"                    		  return '/'
";"                    		  return ';'
":"                    		  return ':'
","                    		  return ','
(?!"..")"."                   	  return '.'
".."				  return '..'
"("                    		  return '('
")"                    		  return ')'
"["                    		  return '['
"]"                    		  return ']'
"before"	       		  return 'BEFORE'
"after"		       		  return 'AFTER'
"has"		       		  return 'HAS'
"is"		       		  return 'IS'
"of"		       		  return 'OF'
"c"		       	      	  return 'C'
[0-9]{4}"-"[0-9]{2}"-"[0-9]{2}        return 'DATE'
[0-9][0-9]*                       return 'NUM'
">"|"<"|"!="|"=="|">="|"<="|"~" return 'CMP'
//(\>|\<|\>=|\<=|==|!=|~|!!)        return 'CMP'
(?!has)(?!of)(?!is)(?!before)(?!after)[^*;/,:.()! <>=~[\]]+       return 'STR'
<<EOF>>                	       	  return 'EOF'
.                      		  return 'INVALID'

/lex

/* operator associations and precedence */

%left '/'
%left ','

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
    | HAS name ':' name
        {$$ = ["edge",{"name":$2,"dir":"has","query":["name",$4]}];}
    | name OF ':' name
        {$$ = ["edge",{"name":$1,"dir":"is","query":["name",$4]}];}
    | HAS name ':' '(' q ')'
        {$$ = ["edge",{"name":$2,"dir":"has","query":$5}];}
    | name OF ':' '(' q ')'
        {$$ = ["edge",{"name":$1,"dir":"is","query":$5}];}
    | '.' name CMP name
        {$$ = ["prop",[$2,$3,$4]];}
    | '.' name CMP NUM
        {$$ = ["prop",[$2,$3,$4]];}
    | BEFORE ':' DATE
        {$$ = ["before",$3];}
    | AFTER ':' DATE
        {$$ = ["after",$3];}
    | '=' name
        {$$ = ["exactly",$2];}
    | '!' name
        {$$ = ["not",[["name",$2]]];}
    | '!' '(' q ')'
        {$$ = ["not",[$3]];}
    | '(' q ')' '[' NUM ']'
        {$$ = ["nbhd",[$2,0,parseInt($5),"any","*"]];}
    | '(' q ')' '[' NUM ':' name ']'
        {$$ = ["nbhd",[$2,0,parseInt($5),"any",$7]];}
    | '(' q ')' '[' NUM ':' name ':' name ']'
        {$$ = ["nbhd",[$2,0,parseInt($5),$7,$9]];}
    | '(' q ')' '[' NUM '..' NUM ']'
        {$$ = ["nbhd",[$2,parseInt($5),parseInt($7),"any","*"]];}
    | '(' q ')' '[' NUM '..' NUM ':' name ']'
        {$$ = ["nbhd",[$2,parseInt($5),parseInt($7),"any",$9]];}
    | '(' q ')' '[' NUM '..' NUM ':' IS ':' name ']'
        {$$ = ["nbhd",[$2,parseInt($5),parseInt($7),$9,$11]];}
    | '(' q ')' '[' NUM '..' NUM ':' HAS ':' name ']'
        {$$ = ["nbhd",[$2,parseInt($5),parseInt($7),$9,$11]];}
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