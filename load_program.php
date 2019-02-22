<?php
/**
 * Created by PhpStorm.
 * User: ekim
 * Date: 2018-12-14
 * Time: 18:59
 */

require __DIR__ . '/vendor/autoload.php';

$program_source = file_get_contents( "./programs/" . $_GET["program_name"] );


echo json_encode( array("raw" => $program_source) );