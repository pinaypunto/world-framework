window.templayed=function(c,e){var b=function(m,h){h=1;m=m.replace(/\.\.\//g,function(){h++;return""});var l=["vars[vars.length - ",h,"]"],k=(m=="."?[]:m.split(".")),g=0;for(g;g<k.length;g++){l.push("."+k[g])}return l.join("")},a=function(g){return g.replace(/\{\{(!|&|\{)?\s*(.*?)\s*}}+/g,function(j,h,l){if(h=="!"){return""}var k=d++;return['"; var o',k," = ",b(l),", s",k," = (((typeof(o",k,') == "function" ? o',k,".call(vars[vars.length - 1]) : o",k,') || "") + ""); s += ',(h?("s"+k):'(/[&"><]/.test(s'+k+") ? s"+k+'.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/>/g,"&gt;").replace(/</g,"&lt;") : s'+k+")"),' + "'].join("")})},f=function(g){return a(g.replace(/\{\{(\^|#)(.*?)}}(.*?)\{\{\/\2}}/g,function(j,h,m,l){var k=d++;return['"; var o',k," = ",b(m),"; ",(h=="^"?["if ((o",k," instanceof Array) ? !o",k,".length : !o",k,') { s += "',f(l),'"; } ']:["if (typeof(o",k,') == "boolean" && o',k,') { s += "',f(l),'"; } else if (o',k,") { for (var i",k," = 0; i",k," < o",k,".length; i",k,"++) { vars.push(o",k,"[i",k,']); s += "',f(l),'"; vars.pop(); }}']).join(""),'; s += "'].join("")}))},d=0;return new Function("vars",'vars = [vars], s = "'+f(c.replace(/"/g,'\\"').replace(/\n/g,"\\n"))+'"; return s;')};