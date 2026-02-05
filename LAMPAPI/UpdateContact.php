<?php
	$inData = getRequestInfo();
	
	$userId = $inData["userId"];
    $contactId = $inData["id"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];

    // TODO: Update with actual connection
	$conn = new mysqli("localhost", "team", "cop4331", "contact_manager"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        # Update contact with new information
		$stmt = $conn->prepare("UPDATE contacts SET firstName=?, lastName=?, phone=?, email=? WHERE userId=? AND id=?");
		$stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $userId, $contactId);
		$stmt->execute();

        # Check if the contact was updated
		if ($stmt->affected_rows > 0)
		{
			returnWithError("");
		}
		else
		{
			returnWithError("Contact not found or no changes made");
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
