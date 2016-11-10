<?php

header("Content-Type: application/json");

$allowed = ['jpg', 'png', 'jpeg'];

if(!empty($_FILES['file']))
{
	if(!$_FILES["file"]["error"])
	{
		$temp = $_FILES["file"]["tmp_name"];
		$name = basename($_FILES["file"]['name']);

		$ext = explode(".", $name);
		$ext = strtolower(end($ext));

		$filename = md5($temp) . time() . "." . $ext;

		if(move_uploaded_file($temp, '../uploads/' . $filename))
		{
			echo json_encode(['success' => 1]);
		}
		else
		{
			echo json_encode(['success' => 0]);
		}
	}
	else
	{
		echo json_encode(['success' => 0]);
	}
}