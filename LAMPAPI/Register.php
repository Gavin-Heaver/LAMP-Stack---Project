<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$username = $inData["username"];
	$password = $inData["password"];

	//connect, dont forget to change to update to new sql user
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT ID FROM users WHERE Login=?");
		$stmt->bind_param("s", $inData["username"]);
		$stmt->execute(); 
		$result = $stmt->get_result();
		
		if($result->fetch_assoc())
		{
			$stmt->close();
			$conn->close();
			returnWithError("Username Already Exists");
		}
		else
		{
			$stmt = $conn->prepare("INSERT into users (firstName, lastName, username, password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $username, $password); //change password to be hash stuff
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithError("Success");
		}
			
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
		
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
		
?>