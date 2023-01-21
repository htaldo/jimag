<?php

$dir = "Docdoc/";
$permitidos= array('pdb','sdf');
$ruta_carga = $dir . $_FILES['Archivo']['name'];
$arregloArchivo= explode(".", $_FILES['Archivo']['name']);
$extension = strtolower(end($arregloArchivo));// .pdb .sdf

        if(!file_exists($dir)){
            mkdir($dir, 0777);
        }
        if (move_uploaded_file($__FILES ['Archivo']['tmp_name'], $ruta_carga)) {
            echo "El archivo se cargó correctamente";
        } else {
            echo "Error al cargar el archivo";
        }
    
   

?>