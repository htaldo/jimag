<?php

$dir = "Docdoc/";
$tamanio= 200; //kb
$permitidos= array('pdb','sdf');
$ruta_carga = $dir . $_FILES['Archivo']['name'];
$arregloArchivo= explode(".", $_FILES['Archivo']['name']);
$extension = strtolower(end($arregloArchivo));// .pdb .sdf

if(in_array($extension, $permitidos)){
    if($__FILES ['Archivo']['size']< ($tamanio*1024)){
        if(!file_exists($dir)){
            mkdir($dir, 0777);
        }
        if (move_uploaded_file($__FILES ['Archivo']['tmp_name'], $ruta_carga)) {
            echo "El archivo se cargó correctamente";
        } else {
            echo "Error al cargar el archivo";
        }
    } else{
        echo "Archivo excede el tamaño permitido";
    }
} else {
    echo "Archivo no permitido";
}



?>