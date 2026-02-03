<?php
	$inData = getRequestInfo();
	
	$userId = $inData["userId"];
    $contactId = $inData["id"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE FROM contacts WHERE userId=? AND id=?");
		$stmt->bind_param("ii", $userId, $contactId);
		$stmt->execute();
		
		if ($stmt->affected_rows > 0)
		{
			returnWithError("");
		}
		else
		{
			returnWithError("Contact not found");
		}
		
		$stmt->close();
		$conn->close();
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
