<?php
	$inData = getRequestInfo();
	
	$userId = $inData["userId"];
    $contactId = $inData["id"];

    // TODO: Update with actual connection
	// $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        # Delete contact that belongs to userId and has the requested id
		$stmt = $conn->prepare("DELETE FROM contacts WHERE userId=? AND id=?");
		$stmt->bind_param("ii", $userId, $contactId);
		$stmt->execute();
		
		# TODO: Possibly return the deleted contact's data
        # Check if the selected contact was deleted
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
