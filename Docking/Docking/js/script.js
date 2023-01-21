function runCommand() {
    // Enviar una solicitud HTTP a un script del lado del servidor
    // El script que se ejecuta en el servidor ejecutará el comando 
   fetch('/script/blish.sh')
   .then(response => response.text())
   .then(output => {
   // Handle the output here
   console.log(output);
    }); }