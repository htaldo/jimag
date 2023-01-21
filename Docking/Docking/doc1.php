<?php
  $uploaded_file = $_FILES['uploaded_file'];
  $upload_directory = '/Docdoc';
  move_uploaded_file($uploaded_file['tmp_name'], $upload_directory . $uploaded_file['name']);
?>
