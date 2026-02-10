const urlBase = 'https://cop4331.lampdanin.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

//New doSignup function
function doSignup()
{
	let firstName = document.getElementById("firstName").value;
	let lastName  = document.getElementById("lastName").value;
	let username  = document.getElementById("signupName").value;
	let password  = document.getElementById("signupPassword").value;

	document.getElementById("signupResult").innerHTML = "";

	let tmp = {
		firstName: firstName,
		lastName: lastName,
		username: username,
		password: password
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error.length > 0)
				{
					document.getElementById("signupResult").innerHTML = jsonObject.error;
					return;
				}

				document.getElementById("signupResult").innerHTML = "Account created successfully!";
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

//Modified from addColor function, added edit function inside
function addContact()
{
	let firstName = document.getElementById("contactFirstName").value;
	let lastName  = document.getElementById("contactLastName").value;
	let phone     = document.getElementById("contactPhone").value;
	let email     = document.getElementById("contactEmail").value;

	document.getElementById("contactResult").innerHTML = "";

	let tmp = {
		firstName,
		lastName,
		phone,
		email,
		userId
	};

	let url;

	if (window.editingContactId)
	{
		//EDIT
		tmp.id = window.editingContactId;
		url = urlBase + '/UpdateContact.' + extension;
	}
	else
	{
		//ADD
		url = urlBase + '/AddContact.' + extension;
	}

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function ()
	{
		if (this.readyState === 4 && this.status === 200)
		{
			document.getElementById("contactResult").innerHTML =
				window.editingContactId ? "Contact updated" : "Contact added";

			window.editingContactId = null;

			document.getElementById("contactFirstName").value = "";
			document.getElementById("contactLastName").value = "";
			document.getElementById("contactPhone").value = "";
			document.getElementById("contactEmail").value = "";

			doSearch();
		}
	};

	xhr.send(JSON.stringify(tmp));
}

//Modified from searchColor function
function doSearch()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("searchResult").innerHTML = "";

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function ()
	{
		if (this.readyState === 4 && this.status === 200)
		{
			let jsonObject = JSON.parse(xhr.responseText);

			if (!jsonObject.results || jsonObject.results.length === 0)
			{
				document.getElementById("searchResult").innerHTML = "No contacts found";
				return;
			}

			let html = "";

			for (let i = 0; i < jsonObject.results.length; i++)
			{
				let c = jsonObject.results[i];

				html += `
					<div class="contactRow">
						<span class="contactInfo">
							${c.firstName} ${c.lastName} | ${c.phone} | ${c.email}
						</span>
						<button class="smallButton"
							onclick='editContact(${JSON.stringify(c)})'>
							Edit
						</button>
						<button class="smallButton danger"
							onclick="deleteContact(${c.id})">
							Delete
						</button>
					</div>
				`;
			}

			document.getElementById("searchResult").innerHTML = html;
		}
	};

	xhr.send(jsonPayload);
}

function deleteContact(contactId)
{
    if (!confirm("Are you sure you want to delete this contact?"))
        return;

    let tmp = {
        id: contactId,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            doSearch(); //refresh list
        }
    };

    xhr.send(jsonPayload);
}

function editContact(contact)
{
	//Store ID so addContact knows this is an edit
	window.editingContactId = contact.id;

	// Autofill edit modal inputs
	document.getElementById("editFirstName").value = contact.firstName;
	document.getElementById("editLastName").value  = contact.lastName;
	document.getElementById("editPhone").value     = contact.phone;
	document.getElementById("editEmail").value     = contact.email;

	//Show edit window
	document.getElementById("editWindow").style.display = "block";

	document.getElementById("contactResult").innerHTML =
		"Editing contact. Make changes and click Save.";
}

//Save button in edit window
function saveEdit()
{
	let firstName = document.getElementById("editFirstName").value;
	let lastName  = document.getElementById("editLastName").value;
	let phone     = document.getElementById("editPhone").value;
	let email     = document.getElementById("editEmail").value;

	let tmp = {
		id: window.editingContactId,
		firstName,
		lastName,
		phone,
		email,
		userId
	};

	let xhr = new XMLHttpRequest();
	xhr.open("POST", urlBase + '/UpdateContact.' + extension, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function ()
	{
		if (this.readyState === 4 && this.status === 200)
		{
			closeEdit();
			doSearch();
		}
	};

	xhr.send(JSON.stringify(tmp));
}

//Cancel button in edit window
function closeEdit()
{
	document.getElementById("editWindow").style.display = "none";
	window.editingContactId = null;
}
