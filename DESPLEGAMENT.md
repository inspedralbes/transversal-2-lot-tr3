# Aquest document explica com desplegar l'aplicació

## Credencials de la BBDD de producció 
<br>Database: a21alecrinor_trivial3Prod
<br>Username: a21alecrinor_trivial3Prod
<br>Password: Qwerty123456

## Per desplegar d'aplicació executar els següents comandaments a la consola de Visual Studio Code
1. Git clone https://github.com/inspedralbes/transversal-2-lot-tr3.git
2. composer update
3. composer install
4. npm install
5. php artisan key:generate

## Configurar .env
Farem una copia del fitxer ".env.example" i l'anomenarem ".env".
Dins modificarem les línies:
DB_CONNECTION=mysql
DB_HOST=labs.inspedralbes.cat
DB_PORT=3306
DB_DATABASE=''
DB_USERNAME=''
DB_PASSWORD=''
A Database, username i password posarem les dades especifícades al principi del document. 
També podem crear una BBDD nova a https://labs.inspedralbes.cat:8083/add/db/ 

## Preparem la BBDD
A la consola del visual studio accedim al laravel, per fer-ho executem cd \web\back.
Un cop ens trobem a la carpeta back executem: php artisan migrate
D'aquesta manera executarem la migració i es crearan les taules necessàries.

## Preparem la web
Accedim a https://labs.inspedralbes.cat:8083/add/web/ i especifiquem quin domini volem crear, en el nostre cas "trivial3.alumnes.inspedralbes.cat" i marquem l'opció "Generate DNS Zone".

## Pujar el projecte a producció
En el nostre cas, hem utilitzat "FileZilla" per pujar els arxius.
Per fer-ho, accedim a FileZilla:
1. Al paràmetre 'Servidor' posem: labs.inspedralbes.cat
2. Nombre de usuario posem el nom d'usuari del labs. 
3. I a 'contraseña' la contrassenya del nostre labs.
4. Accedim llavors a /web/domini/public_html on domini és el creat anteriorment, i copiem els arxius de dins de la carpeta 'web'.

## Configurar CRON per les preguntes diàries
1. Accedim a https://labs.inspedralbes.cat:8083/list/cron
2. A l'input "command" escrivim la ruta absoluta de la nostra web amb el següent paràmetre:
    cd 'ruta' && php artisan schedule:run >> /dev/null 2>&1
En el meu cas queda de la següent forma: cd /home/a21alecrinor/web/trivial3.alumnes.inspedralbes.cat/public_html/web/back && php artisan schedule:run >> /dev/null 2>&1
3. A la pestanya "minutes" marquem "every minute" a "run command" i fem clic a "Generate".

Ara el cron s'executarà cada minut, i revisarà si ha d'executar alguna tasca.