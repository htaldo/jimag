<?php

$dir = "/Docdoc";
$permitidos= array('pdb','sdf');
$ruta_carga = $dir . $_FILES['Protein']['name'];
$arregloArchivo= explode(".", $_FILES['Protein']['name']);
$extension = strtolower(end($arregloArchivo));// .pdb .sdf

        if(!file_exists($dir)){
            mkdir($dir, 0777);
        }
        if (move_uploaded_file($__FILES ['Protein']['tmp_name'], $ruta_carga)) {
            echo "El archivo se cargó correctamente";
        } else {
            echo "Error al cargar el archivo";
        }
    
   

?>