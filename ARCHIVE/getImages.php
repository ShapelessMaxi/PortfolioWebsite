
<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['projectNames'])) {
    // The request is using the GET + is set the PARAMETER
    //echo($_GET['projectNames']);
    $dir    = 'project_data/'.$_GET['projectNames'];
    //echo($dir);
    $fileNames= scandir($dir);
    $outArr =[];
    for($i=0; $i<count($fileNames);$i++){
        if(!(str_starts_with($fileNames[$i],"."))){
            $outArr[]=$fileNames[$i];
        }
    }
    echo(json_encode(($outArr)));



}

// $dir    = '/project_data';
// $files1 = scandir($dir);
// $files2 = scandir($dir, SCANDIR_SORT_DESCENDING);

// print_r($files1);
// print_r($files2);
?>
