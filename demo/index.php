<!DOCTYPE html>
<html>
<head>

	<meta charset="utf-8" />
	<title>Uploader</title>

	<link href="vendor/bootstrap.min.css" rel="stylesheet" />
	<link href="../src/easyup.css" rel="stylesheet" />

</head>
<body>

	<br /><br />

	<div class="container">
		<div class="row">
			<div class="col-sm-8 col-sm-offset-2">

				<!-- File Uploader -->
				<div id="file-uploader"></div>

			</div>
		</div>
	</div>

	<script src="vendor/jquery.min.js"></script>
	<script src="vendor/bootstrap.min.js"></script>
	<script src="../src/easyup.js"></script>
	<script>
		$(document).on('ready', function()
		{

			$('#file-uploader').EasyUp({
				url: 'server/'
			});

		});
	</script>

</body>
</html>