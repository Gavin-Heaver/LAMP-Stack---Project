<?php
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	
	//change the connection to sql database to match updated
	$conn = new mysqli("localhost", "team", "cop4331", "contact_manager"); 
		
	if( $conn->connect_error ) //check connection if it good
	{
		returnWithError( $conn->connect_error );
	} 
	else // if it is do this 
	{
		//need to add code to do the hashing stuff
		$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM users WHERE username=? AND password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]); 
		$stmt->execute();
		$result = $stmt->get_result();
		
		
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo() // pulls the info from the json, fills into $inData
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
			$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
			sendResultInfoAsJson( $retValue );
		}
			
	function returnWithInfo( $firstName, $lastName, $id )
		{
			$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
			sendResultInfoAsJson( $retValue );
		}
?>