var db = new alasql.Database();

			//creating users table
			db.exec('CREATE TABLE users ('+
				'id int PRIMARY KEY,'+
				'username varchar(255),'+
				'password varchar(255),' +
				'address varchar(255)' +
				')'
			);

			//creating books table
			db.exec('CREATE TABLE books ('+
				'id int PRIMARY KEY,'+
				'title varchar(255),'+
				'author varchar(255),' +
				'genre varchar(255),' +
				'year int,' +
				'price float' +
				')'
			);

			//creating join table for users and books
			db.exec('CREATE TABLE usersBooks ('+
				'id int PRIMARY KEY,'+
				'uid int,'+
				'bid int' +
				')'
			);

			//Adding books to books table
			db.exec('INSERT INTO books VALUES(0, "Moby Dick", "Herman Melville", "fiction", 1851, 8.95)');
			db.exec('INSERT INTO books VALUES(1, "Harry Potter and the Prisoner of Azkaban", "JK Rowlings", "fantasy", 1999, 30.00)');
			db.exec('INSERT INTO books VALUES(2, "Matilda", "Roal Dahl", "fiction", 1988, 3.00)');
			db.exec('INSERT INTO books VALUES(3, "The Great Gatsby", "F. Scott Fitzgerald", "adventure", 1999, 2.50)');
			db.exec('INSERT INTO books VALUES(4, "Hamlet", "William Shakespeare", "romantic", 1999, 15.00)');
			db.exec('INSERT INTO books VALUES(5, "The Odyssey", "Homer", "adventure", 1788, 3.00)');

			//Adding user to users table
			db.exec('INSERT INTO users VALUES(0, "trey", "123", "225 CPN")');


			//keeps track of who is logged in
			var userID = undefined;

			function login(){

        // grab the input value of the username and password form
				var un = document.getElementById('lun').value;
				var pw = document.getElementById('lpw').value;

				//find user with corresponding username and password
				var result = db.exec(`SELECT * FROM users WHERE username="${un}" AND password="${pw}"`);

				//if results is empty, user doesn't exist or password is incorrect
				if(result.length == 0){
					alert('USER DOES NOT EXIST / PASSWORD IS INCORRECT');
				}else{
					//this is the user currently logged in
					userID = result[0].id;

          console.log(result)

					alert('Welcome ' + result[0].username);
					//makes login page invisible
					document.getElementById('loginPage').style.display = 'none';
					//makes main page visible
					document.getElementById('mainPage').style.display = 'block';
					displayCart();
				}
			}

			function signup(){
				var un = document.getElementById('sun').value;
				var ad = document.getElementById('sad').value;
				var pw = document.getElementById('spw').value;
				var pw2 = document.getElementById('spw2').value;

				//check if passwords are the same
				if(pw != pw2){
					document.getElementById('spw').style.backgroundColor = 'red';
					document.getElementById('spw2').style.backgroundColor = 'red';
					alert('Passwords must match!');
				}else{
					//gets amount of users, so we can use that as the id for the next user
					var id = db.exec('SELECT * FROM users').length;
					//adds user to database
					db.exec(`INSERT INTO users VALUES(${id}, "${un}", "${pw}", "${ad}")`);
					//this is the user currently logged in
					userID = id;
					alert('Welcome ' + un);
					//makes login page invisible
					document.getElementById('loginPage').style.display = 'none';
					//makes main page visible
					document.getElementById('mainPage').style.display = 'block';
					displayCart();
				}
			}

			function logout(){
				//no one is logged in
				userID = undefined;

				//empties values for login section
				document.getElementById('lun').value = '';
				document.getElementById('lpw').value = '';

				//empties values for signup section
				document.getElementById('sun').value = '';
				document.getElementById('sad').value = '';
				document.getElementById('spw').value = '';
				document.getElementById('spw2').value = '';
				document.getElementById('spw').style.backgroundColor = 'white';
				document.getElementById('spw2').style.backgroundColor = 'white';

				//makes main page invisible
				document.getElementById('mainPage').style.display = 'none';
				//makes login page visible
				document.getElementById('loginPage').style.display = 'block';

				//refreshMainPage
				document.getElementById('category').value = 'title';
				document.getElementById('input').value = '';
				document.getElementById('results').innerHTML = '';
			}

			function search(){
				var category = document.getElementById('category').value;
				var input = document.getElementById('input').value;

				//finds books based on the category the user chose
				var results = db.exec(`SELECT * FROM books WHERE ${category}="${input}"`);

				var display = document.getElementById('results');
				display.innerHTML = '';
				for(var i=0; i < results.length; i++){
					//for each book in the array create a box diplaying its title and price and a button that calls the addToCart function
					var div = document.createElement('div');
					div.innerHTML = '<h3>'+ results[i].title +' | $'+ results[i].price +'</h3> <input type="button" value="ADD" onclick="addToCart('+ results[i].id +')">';
					//give the div the class "book"
					div.className = 'book';
					//adds div to display
					display.appendChild(div);
				}
			}

			function addToCart(bookID){
				//gets amount of records, so we can use that as the id for the next record
				var id = db.exec('SELECT * FROM usersBooks').length;
				db.exec(`INSERT INTO usersBooks VALUES(${id}, ${userID}, ${bookID})`);
				displayCart();
			}

			function displayCart(){
				var total = 0;
				document.getElementById('items').innerHTML = '';
				//finds all the bookids associated with current user
				var results = db.exec(`SELECT bid FROM usersBooks WHERE uid=${userID}`);
				for(var i=0; i<results.length; i++){
					//for each book display its title and price, then add its price to total
					var book = db.exec(`SELECT * FROM books WHERE id=${results[i].bid}`);
					var li = document.createElement('li');
					li.innerHTML = book[0].title +' | $'+ book[0].price;
					document.getElementById('items').appendChild(li);

					total += book[0].price;
				}
				document.getElementById('total').innerHTML = 'Total: $' + total;
			}
