
/* document fixes for ie 11 */


/*

xx other issue browser detect needed to limit colors by browser.
xx jscore warnings upate that too
xx  npm install --save core-js@^3
xx  npm install browser-detect


o tsconfig.json / change these two lines:

     "target": "es5",
  
     "lib": [
        "es2015",

o index.html

    <meta charset="utf-8">   after this line add the next:
  
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

o set up prefixURL in the environment folder.


export const environment = {
  production: false,
  urlPreifx:  ":http://localhost:3200/"  // from appservice.ts
};
 
o hard coded labels to dodger blue in all css in all cases to accomodate
  ie11. why: debugging showed undefined for component variables in ie11
  but in chrome they were defined.
  (( workaround )) 2.24.2020


  */