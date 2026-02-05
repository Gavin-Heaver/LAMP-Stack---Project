<?php
	$inData = getRequestInfo();

	$userId = $inData["userId"];
	
	$searchResults = "";
	$searchCount = 0;

	// TODO: Update with actual connection
	$conn = new mysqli("localhost", "team", "cop4331", "contact_manager"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		# Send SQL query to search contact by firstName, lastName, phone, email
		$stmt = $conn->prepare("SELECT * from contacts where (firstName like ? OR lastName like ? OR phone like ? OR email like ?) and userId=?");
		$searchPattern = "%" . $inData["search"] . "%";
		$stmt->bind_param("ssssi", $searchPattern, $searchPattern, $searchPattern, $searchPattern, $userId);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			# Convert contact fields to JSON and append to results
			$searchResults .= json_encode($row);	
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>