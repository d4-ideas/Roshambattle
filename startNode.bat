START "runas /user:administrator" cmd /K "cd C:\mongodb\bin\ & mongod"

TIMEOUT 3

START "runas /user:administrator" cmd /K "set port=3000 & cd C:\GitHub\roshambattle\ & nodemon app"

timeout 3

"C:\Program Files (x86)\Brackets\Brackets.exe"